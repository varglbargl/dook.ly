var url = require('url');
var fs = require('fs');
var colors = require('./colorHelpers.js');
var server = require('./personal-server.js');

exports.identifyImages = function (css, results, rurl, res) {
  var images = [];

  var pngParsed = css.toString().split('.png');
  var jpgParsed = css.toString().split('.jpg');
  var gifParsed = css.toString().split('.gif');

  for (var i = 0; i < pngParsed.length; i+=2) {
    var png = pngParsed[i].split('url(')[1].replace('\'', '').replace('\"', '') + '.png';
    if (png && png.indexOf(' ') === -1) {
      images.push(png);
    }
  };

  for (var i = 0; i < jpgParsed.length; i+=2) {
    var jpg = jpgParsed[i].split('url(')[1].replace('\'', '').replace('\"', '') + '.jpg';
    if (jpg && jpg.indexOf(' ') === -1) {
      images.push(jpg);
    }
  };

  for (var i = 0; i < gifParsed.length; i+=2) {
    var gif = gifParsed[i].split('url(')[1].replace('\'', '').replace('\"', '') + '.gif';
    if (gif && gif.indexOf(' ') === -1) {
      images.push(gif);
    }
  };

  images = server.unique(images);

  console.log('Identified', images.length, 'image(s) in file.');
  // console.log('Assuming', images, 'are images.');
};

var downloadImages = function () {
  
}