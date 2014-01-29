var url = require('url');
var http = require('http');
var colors = require('./colorHelpers.js');
var server = require('./personal-server.js');
var images = require('./imageHelpers.js');
var cssData = require('./res/data.js');

exports.identifyCSS = function (hash, rurl, res) {
  console.log('Attempting to identify css of', hash);
  var html = cssData[hash].html;

  var findLinkTags = function (html) {
    var result = [];
    html = html.toString().split('.css');

    while (Array.isArray(html) && html.length !== 0) {
      var linkTag = html[0].split('=');
      linkTag = linkTag[linkTag.length-1];
      var css = (linkTag+'.css').replace("'", '').replace('"', '').replace('\\', '').replace(' ', '').split('http://');
      css = css[css.length-1];
      var cssURL = unescape(url.resolve(rurl, css));
      html = html.slice(1);
      if (cssURL.indexOf('>') === -1 && cssURL.indexOf('<') === -1 && cssURL.indexOf(' ') === -1){
        result.push(cssURL);
      }
    }
    return result;
  };

  var results = findLinkTags(html);
  console.log('URLs of CSS file believed to be', results);

  downloadCSS(results, res, hash);
};

var downloadCSS = function(rurls, res, hash){
  var proceedToMining = server.after(rurls.length, function () {
    mineCSS(res, hash);
  });

  for (var i = 0; i < rurls.length; i++) {
    console.log('Downloading css:', rurls[i]);
    http.get(rurls[i], function (response) {

      var cssText = '';
      response.on('data', function (chunk) {
        cssText += chunk;
      });

      response.on('end', function () {
        cssData[hash].css.push(cssText);
        proceedToMining();
      });
    });
  }

};

var mineCSS = function (res, hash) {

  console.log('Proceeding to analyze', cssData[hash].css.length, 'CSS files.');
  
  var results = {colors:[], fonts:[]};

  var parseCSS = function (cssContents) {
    // colors
    var hexParsed = cssContents.toString().split(/\:\s?\#/);
    var rgbaParsed = cssContents.toString().split(/\:\s?rgba\(/);
    var rgbParsed = cssContents.toString().split(/\:\s?rgb\(/);

    for (var i = 1; i < hexParsed.length; i+=2) {
      var thisHex = hexParsed[i].slice(0, 6).split(';')[0].toString();
      if((/[a-fA-F0-9]/).test(thisHex)){
        results.colors.push(colors.hexToRGB(thisHex));
      }
    }

    for (var j = 1; j < rgbParsed.length; j+=2) {
      var rgbValues = rgbParsed[j].split(',');
      if(rgbaValues.length === 3){
        results.colors.push( [parseInt(rgbValues[0]), parseInt(rgbValues[1]), parseInt(rgbValues[2])] );
      }
    }

    for (var k = 1; k < rgbaParsed.length; k+=2) {
      var rgbaValues = rgbaParsed[k].split(',');
      if(rgbaValues.length === 4){
        results.colors.push( [parseInt(rgbaValues[0]), parseInt(rgbaValues[1]), parseInt(rgbaValues[2])] );
      }
    }

    // fonts

    var fontParsed = cssContents.toString().split('font-family: ');
    for (var i = 1; i < fontParsed.length; i+=2) {
      results.fonts.push(fontParsed[i].split(';')[0].split(',')[0].replace("'", '').replace('"', '').replace("'", '').replace('"', ''));
    }
    results.fonts = server.unique(results.fonts);

    proceedToCheckout(res, results);
  };

  var proceedToCheckout = server.after(cssData[hash].css.length, function (res, results) {
    results.colors = server.unique(results.colors);
    console.log('Identified', results.fonts.length, 'font(s) in file.');
    console.log('Identified', results.colors.length, 'color(s) in file.');

    if (results.colors.length > 6) {
      results.colors = colors.assembleColorPalette(results.colors);
    } else {
      console.log('Not enough colors to assemble full color pallete.');
    }

    // Planned feature: Image color analysis. I know it's possible...
    // images.identifyImages(cssContents, results, rurl, res);
    server.returnData(res, results);
  });

  for (var i = 0; i < cssData[hash].css.length; i++) {
    parseCSS(cssData[hash].css[i]);
  }
};