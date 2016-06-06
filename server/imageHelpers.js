var url = require('url');
var fs = require('fs');
var colors = require('./colorHelpers.js');
var server = require('./server.js');
var css = require('./cssHelpers.js');

module.exports.identifyImages = function (cssFile, results, rurls, res) {
  var images = [];

  var parseImages = function (file) {
    var pngParsed = cssFile.toString().split('.png');
    var jpgParsed = cssFile.toString().split('.jpg');
    var gifParsed = cssFile.toString().split('.gif');

    for (var i = 0; i < pngParsed.length-1; i+=2) {
      var png = pngParsed[i].split('url(')[1].replace('\'', '').replace('\"', '') + '.png';
      if (png && png.indexOf(' ') === -1) {
        images.push(url.resolve(file, png));
      }
    }

    for (var i = 0; i < jpgParsed.length-1; i+=2) {
      var jpg = jpgParsed[i].split('url(')[1].replace('\'', '').replace('\"', '') + '.jpg';
      if (jpg && jpg.indexOf(' ') === -1) {
        images.push(url.resolve(file, jpg));
      }
    }

    for (var i = 0; i < gifParsed.length-1; i+=2) {
      var gif = gifParsed[i].split('url(')[1].replace('\'', '').replace('\"', '') + '.gif';
      if (gif && gif.indexOf(' ') === -1) {
        images.push(url.resolve(file, gif));
      }
    }

    proceedToDownload();
  };

  for (var i = 0; i < rurls.length; i++) {
    parseImages(rurls[i]);
  }

  var proceedToDownload = server.after(rurls.length, function () {
    images = server.unique(images);

    console.log('Identified', images.length, 'image(s) in file.');
    console.log('Assuming', images, 'are images.');
  });

};

// TODO find out how to write and read images in node.
// for some reason they always come out as unreadable.
var downloadImages = function () {

}
