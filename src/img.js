$(document).ready( function () {

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

  var rgbToHex = function (r, g, b) {
    if (r > 255 || g > 255 || b > 255) {
      throw "Invalid color component";
    }
    return ((r << 16) | (g << 8) | b).toString(16);
  };


  // set up some squares
  var example = document.getElementById('example');
  var sample = document.getElementById("sample");
  var context = example.getContext('2d');
  context.drawImage(sample, 0, 0, 200, 200);
  //var context = canvas.getContext("2d");

  $('#example').mousemove(function(e) {
    var pos = findPos(this);
    var x = e.pageX - pos.x;
    var y = e.pageY - pos.y;
    var coord = "x = " + x + " ,  y = " + y;
    var c = this.getContext('2d');
    var p = c.getImageData(x, y, 1, 1).data; 
    var rgb = 'rgb(' + p[0] + ',' + p[1] + ',' + p[2] + ')';
    var hex = '#' + ("000000" + rgbToHex(p[0], p[1], p[2])).slice(-6);
    var comp = '#' + ("000000" + rgbToHex(255-p[0], 255-p[1], 255-p[2])).slice(-6);
    $('#status').html(coord + "<br>RGB: " + rgb + "<br>HEX: " + hex);
    $('#color').css('background-color', hex);
    $('#compliment').css('background-color', comp);
  });

  var getAllColorData = function () {

    var result = [];

    for (var i = 0; i < 200; i++) {
      var p = $('#example').get(0).getContext('2d').getImageData(i, i, 10, 10).data;
      result.push[]
    };

    return result;
  };

  var assembleColorPallete = function (colorArray) {

  };

  $('#average').css('background-color', getAverage());

});