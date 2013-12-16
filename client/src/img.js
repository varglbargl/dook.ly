$(document).ready(function (image) {

  // I did not write this next function, it will not be part of the final product (probably)
  // but just trust that it works.
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
  var rgbToHex = function (r, g, b) {
    if (r > 255 || g > 255 || b > 255) {
      throw 'Invalid color component';
    }
    return ((r << 16) | (g << 8) | b).toString(16);
  };

  // image from html provided for testing and demo purposes
  // look for plant.png in /res
  var renderImage = function () {
    var example = $('#example').get();
    console.log(example)
    var sample = image;
    var context = example.getContext('2d');
    context.drawImage(sample, 0, 0, 200, 200);
  };

  renderImage();

  // find the position of the mouse on an HTML5 canvas element and gathers single pixel color information
  // purely for demo purposes. There should be no need for jQuery in the final product.
  $('#example').mousemove(function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coord = 'x = ' + x + ' ,  y = ' + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data;
    var rgb = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
    var hex = '#' + ('000000' + rgbToHex(p[0], p[1], p[2])).slice(-6);
    var comp = '#' + ('000000' + rgbToHex(255-p[0], 255-p[1], 255-p[2])).slice(-6);

    $('#status').html(coord + '<br>RGB: ' + rgb + '<br>HEX: ' + hex);
    $('#color').css('background-color', hex);
    $('#compliment').css('background-color', comp);
  });

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

  // for assembling color palette from array of raw rgb data from images
  // tolerance is used to specify how different your resulting color palette can be. Higher value means less results with higher contrast.
  var assembleColorPalette = function (colorArray, tolerance) {
    var distinctHues = [colorArray[0]]; // because it has to have something to compare to initially. Probably a better way to handle this.

    for (var i = 1; i < colorArray.length; i++) {
      var distinct = true;
      for (var j = 0; j < distinctHues.length; j++) {
        // probably a better way to do this one too:
        var contrast = (Math.abs(colorArray[i][0] - distinctHues[j][0])) + (Math.abs(colorArray[i][1] - distinctHues[j][1])) + (Math.abs(colorArray[i][2] - distinctHues[j][2]));
        if(contrast < tolerance) {
          distinct = false;
        }
      }
      if(distinct){
        distinctHues.push(colorArray[i]);
      }
    }

    // TODO: Pare down results if it's too long.  Possibly with recursion.
    return distinctHues;
  };

  var colorData = getColorData(example, 10);

  var getAverageColor = function (colorArray) {
    var red = 0;
    var green = 0;
    var blue = 0;

    for (var i = 0; i < colorArray.length; i++) {
      red += colorArray[i][0];
      green += colorArray[i][1];
      blue += colorArray[i][2];
    };

    red = Math.round(red / colorArray.length);
    green = Math.round(green / colorArray.length);
    blue = Math.round(blue / colorArray.length);

    return 'rgb(' + red + ', ' + green + ', ' + blue + ')';
  };

  var palette = assembleColorPalette(colorData, 200);

  for (var i = 0; i < palette.length; i++) {
    $('body').append('<div style="background-color:rgb(' + palette[i] + ');width:200px;height:25px;"></div>');
  }

  var averageRGB = getAverageColor(colorData);

  $('#average').css('background-color', averageRGB);

  $('#refresh').click(function () {
    renderImage();
  });
});