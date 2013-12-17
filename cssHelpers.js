var fs = require('fs');
var url = require('url');
var http = require('http')
var colors = require('./colorHelpers.js');
var server = require('./personal-server.js');
var images = require('./imageHelpers.js');

exports.identifyCSS = function (file, rurl, res) {
  console.log('Attempting to identify css of', file);
  var html = fs.readFileSync(file);

  var findLinkTags = function (html) {
    var result = '';

    return result;
  };

  var linkTag = html.toString().split('.css')[0];

  if (linkTag.length > 1) {
    linkTag = linkTag.split('href=');
    linkTag = linkTag[linkTag.length-1];
  }

  var css = (linkTag+'.css').replace("'", '').replace('"', '');
  var cssURL = unescape(url.resolve(rurl, css));
  console.log('URL of CSS file believed to be', cssURL);
  downloadCSS(cssURL, res);
};

var downloadCSS = function(rurl, res){
  console.log('Downloading css:', rurl);
  http.get(rurl, function(response){

    var cssData = '';
    response.on('data', function(chunk){
      cssData += chunk;
    });

    response.on('end', function () {
      saveCSS(cssData, rurl, res);
    });
  })
};

var saveCSS = function (file, rurl, res) {
  var localFile = __dirname + '/res/' + 'css.txt';
  fs.writeFile(localFile, file, function(err) {
    if( err ){
      console.log("Failed to create file for ", rurl);
    } else {
      console.log(localFile + " created.");
      mineCSS(localFile, res);
    }
  });
}

var mineCSS = function (file, res) {
  
  var results = {colors:[], fonts:[]};
  var cssContents = fs.readFileSync(file);

  // colors

  var hexParsed = cssContents.toString().split(': #');
  var rgbaParsed = cssContents.toString().split(': rgba(');
  var rgbParsed = cssContents.toString().split(': rgb(');

  for (var i = 1; i < hexParsed.length; i+=2) {
    results.colors.push(colors.hexToRGB(hexParsed[i].slice(0, 6).split(';')[0]));
  };

  for (var j = 1; j < rgbParsed.length; j+=2) {
    var rgbValues = rgbParsed[j].split(',');
    results.colors.push( [parseInt(rgbValues[0]), parseInt(rgbValues[1]), parseInt(rgbValues[2])] );
  };

  for (var k = 1; k < rgbaParsed.length; k+=2) {
    var rgbaValues = rgbaParsed[k].split(',');
    results.colors.push( [parseInt(rgbaValues[0]), parseInt(rgbaValues[1]), parseInt(rgbaValues[2])] );
  };

  console.log('Identified', results.colors.length, 'color(s) in file.');

  if (results.colors.length > 5){
    results.colors = colors.assembleColorPalette(results.colors);
  } else {
    console.log('Not enough colors available for complete color pallete.');
  };


  // fonts

  var fontParsed = cssContents.toString().split('font-family: ');
  for (var i = 1; i < fontParsed.length; i+=2) {
    results.fonts.push(fontParsed[i].split(';')[0].split(',')[0].replace("'", '').replace('"', '').replace("'", '').replace('"', ''));
  }

  console.log('Isentified', results.fonts.length, 'font(s) in file.');

  images.identifyImages(cssData, results, res);
};