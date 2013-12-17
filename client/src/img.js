
// For finding mouse position over a canvas element.
var findPos = function (obj) {
  var curleft = 0, curtop = 0;
  if (obj.offsetParent) {
    do {
      curleft += obj.offsetLeft;
      curtop += obj.offsetTop;
    } while (obj = obj.offsetParent);
    return { x: curleft, y: curtop };
  }
  return undefined;
};

// The only problem with this is it interprets transparent as #000000
// TODO: Look into the possibility of detecting opacity and ignoring 0s
var rgbToHex = function (rgb) {
  if (Array.isArray(rgb)) {
    var r = rgb[0];
    var g = rgb[1];
    var b = rgb[2];
  } else {
    rgb = rgb.split(',');
    var r = parseInt(rgb[0].split('(')[1]);
    var g = parseInt(rgb[1]);
    var b = parseInt(rgb[2].split(')')[0]);
  }

  var hex = ('000000' + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
  if (hex[0] === hex[1] && hex[2] === hex[3] && hex[4] === hex[5]) {
    hex = hex[0] + hex[2] + hex[4];
  }

  return '#' + hex;
};

// image from html provided for testing and demo purposes
// look for plant.png in /res
// var renderImage = function () {
//   var example = $('#example').get();
//   console.log(example)
//   var sample = image;
//   var context = example.getContext('2d');
//   context.drawImage(sample, 0, 0, 200, 200);
// };

// renderImage();

// Gathers single pixel color information from mouse position over a canvas element.
// purely for demo purposes. There should be no need for jQuery in the final product.
// $('#example').mousemove(function(e) {
//   var pos = findPos(this);
//   var x = e.pageX - pos.x;
//   var y = e.pageY - pos.y;
//   var coord = 'x = ' + x + ' ,  y = ' + y;
//   var c = this.getContext('2d');
//   var p = c.getImageData(x, y, 1, 1).data;
//   var rgb = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
//   var hex = '#' + ('000000' + rgbToHex(p[0], p[1], p[2])).slice(-6);
//   var comp = '#' + ('000000' + rgbToHex(255-p[0], 255-p[1], 255-p[2])).slice(-6);

//   $('#status').html(coord + '<br>RGB: ' + rgb + '<br>HEX: ' + hex);
//   $('#color').css('background-color', hex);
//   $('#compliment').css('background-color', comp);
// });

// samples every color of an image.
// takes one argument that determines the granularity of your color search.
// larger values will retrieve lower contrast/more averaged colors by sampling larger areas.
// 200 is just a placeholder value for the demo. Will use width and height of image to allow for finer grain sampling.
var getColorData = function (image, chunkSize) {
  var result = [];

  for (var i = chunkSize; i <= 200-chunkSize; i += chunkSize) {
    for (var j = chunkSize; j <= 200-chunkSize; j += chunkSize) {
      var p = image.getContext('2d').getImageData(i, j, chunkSize, chunkSize).data;
      result.push([p[0], p[1], p[2]]);
    }
  }

  return result;
};

// for (var i = 0; i < palette.length; i++) {
//   $('body').append('<div style="background-color:rgb(' + palette[i] + ');width:200px;height:25px;"></div>');
// }

// var averageRGB = getAverageColor(colorData);

// $('#average').css('background-color', averageRGB);

// $('#refresh').click(function () {
//   renderImage();
// });