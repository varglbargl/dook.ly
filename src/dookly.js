var featuredPalette = ['#5381fa', '#4c3a28', '#ececec', '#d0ceb4', '#120b08'];
var featuredFonts = ['Lobster', 'Futura'];

$(document).ready(function () {

  for (var i = 0; i < featuredPalette.length; i++) {
    $('#featuredColorPalette').append('<div class="color"\
      style="background-color: ' + featuredPalette[i]
      + '"></div><div class="hex"><h3 class="hexValue">'
      + featuredPalette[i].toUpperCase() + '</h3></div><br />');
  }

  for (var i = 0; i < featuredFonts.length; i++) {
    $('#featuredFonts').append('<div class="font" style="font-family:' + featuredFonts[i] + '"><h2 class="fontName">' + featuredFonts[i] + '</h2></div>');
  }

  $('#results').hide();

  $('.stop').on('submit', function (e) {
    e.preventDefault();

    $('#splash').hide();
    $('#colorPalette').html('<h1 class="header">Color Palette</h1>').hide();
    $('#fonts').html('<h1 class="header">Font Profile</h1>').hide();
    $('#loadry').show();

    $.ajax({
      url: '/dook',
      data: {
        url: $('.urlField').val() // stop trying to put a semicolon here
      },
      contentType: 'application/json; charset=utf-8',
      dataType: 'json',
      method: 'GET',
      success: function (data) {
        $('body').css('background-color', lightest(data.colors));
        $('h1').css('color', brightest(data.colors));

        $('#loadry').hide();
        $('#results').show()
        $('#colorPalette').show();
        for (var i = 0; i < data.colors.length; i++) {
          $('#colorPalette').append('<div class="color"\
            style="background-color: ' + data.colors[i]
            + '"></div><div class="hex"><h3 class="hexValue">'
            + data.colors[i].toUpperCase() + '</h3></div><br />');
        }
        $('#fonts').show();
        for (var i = 0; i < data.fonts.length; i++) {
          $('#fonts').append('<div class="font" style="font-family:' + data.fonts[i] + '"><h2 class="fontName">' + data.fonts[i] + '</h2></div>');
        }
      },
      error: function (err) {
        console.log(err);
      }
    });
  });

  // -- HELPERS

  var hexToRGB = function (hex) {
    var rgb = [];

    if( hex.length === 7 || hex.length === 4){
      hex = hex.slice(1);
    }
    if(hex.length === 3){
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    rgb.push(parseInt(hex[0]+hex[1], 16));
    rgb.push(parseInt(hex[2]+hex[3], 16));
    rgb.push(parseInt(hex[4]+hex[5], 16));

    return rgb;
  };

  var brightest = function (colors) {
    var result = [];
    var brightestBright = 0;

    for (var i = 0; i < colors.length; i++) {
      var rgb = hexToRGB(colors[i]);
      var brightness = rgb[0] - rgb[1];

      if (Math.abs(brightness) > brightestBright  && brightness > 0) {
        result = rgb;
        brightestBright = brightness;
      }
      brightness = rgb[1] - rgb[2];

      if (Math.abs(brightness) > brightestBright  && brightness > 0) {
        result = rgb;
        brightestBright = brightness;
      }
      brightness = rgb[2] - rgb[0];

      if (Math.abs(brightness) > brightestBright  && brightness > 0) {
        result = rgb;
        brightestBright = brightness;
      }
    }

    return 'rgb(' + result.toString() + ')'
  };

  var lightest = function (colors) {
    var result = [];
    var lightestLight = 0;

    for (var i = 0; i < colors.length; i++) {
      var rgb = hexToRGB(colors[i]);
      var lightness = rgb[0] + rgb[1] + rgb[2];

      if (lightness > lightestLight  && lightness < 765) {
        result = rgb;
        lightestLight = lightness;
      }
    }

    return 'rgb(' + result.toString() + ')'
  };

});
