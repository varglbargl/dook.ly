$(document).ready(function () {
  $('#colorPalette').hide();
  $('#fonts').hide();
  $('.stop').on('submit', function (e) {
    e.preventDefault();
    $('#colorPalette').html('').hide();
    $('#fonts').html('').hide();
    $('#loadry').show();

    $.ajax({
      data: {
        url: $('.urlField').val();
      },
      method: 'GET',
      success: function (data) {
        console.log(data);
        data = JSON.parse(data);
        $('#loadry').hide();
        $('#colorPalette').show();
        for (var i = 0; i < data.colors.length; i++) {
          $('#colorPalette').append('<div class="color" style="background-color: ' + data.colors[i] + '"></div>');
        }
        $('#fonts').show();
        for (var i = 0; i < data.fonts.length; i++) {
          $('#fonts').append('<div class="font"><h3>' + data.fonts[i] + '</h3></div>');
        }
      }
    });
  });
});