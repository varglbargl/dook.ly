var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var querystring = require('querystring');
var http = require('http');
var https = require('https');
var server = http.Server(app);
var path = require('path');

var cssHelpers = require('./cssHelpers.js');
var colors = require('./colorHelpers.js');
var cssData = require('./data.js');

// -- SERVE STATIC FILES and JSON

app.use(express.static('public'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// -- HELPERS

app.get('/dook', function (req, res) {
  console.log(querystring.parse(req.url));
  if( querystring.parse(req.url)['/dook?url'] ) {
    downloadPage(unescape(req.url.split('=')[1]), res);
  } else {
    res.send('Error: URL does not contain a URL. I mean it does but uh, look it just needs more URLs okay?');
  }
});

var downloadPage = function (rurl, res) {
  console.log('Downloading html:', rurl);

  if (rurl.slice(0,5) === 'https') {
    https.get(rurl, function(response){

      var pageData = '';
      response.on('data', function(chunk){
        pageData += chunk;
      });

      response.on('end', function () {
        savePage(pageData, rurl, res);
      });
    });
  } else {
    http.get(rurl, function(response){

      var pageData = '';
      response.on('data', function(chunk){
        pageData += chunk;
      });

      response.on('end', function () {
        savePage(pageData, rurl, res);
      });
    });
  }
};

var savePage = function (page, rurl, res) {
  var timeHash = new Date().getTime();
  cssData[timeHash] = {html: page.toString(), css: [], https: (rurl.slice(0,5) === 'https')};
  cssHelpers.identifyCSS(timeHash, rurl, res);
};

// and then some other stuff hapens...

module.exports.returnData = function (res, data) {
  for (var i = 0; i < data.colors.length; i++) {
    data.colors[i] = colors.rgbToHex(data.colors[i]);
  }
  console.log('returning colors', data.colors, 'and fonts', data.fonts);
  var headers = corsHeaders;
  res.writeHead(200, headers);
  res.end(JSON.stringify(data));
};

// -- HELPERS

module.exports.unique = function (array) {
  for (var i = 0; i < array.length; i++) {
    if (array.indexOf(array[i], i+1) !== -1){
      array.splice(i, 1);
      i--;
    }
  }
  return array;
};

// Lo-Dash: The cure for your async headaches
module.exports.after = function (n, func) {
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
};

// -- START SERVER

var port = process.env.PORT || 3030;
console.log('Listening on port', port);
server.listen(port);
