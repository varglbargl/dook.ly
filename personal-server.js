var http = require('http');
var path = require('path');
var url  = require('url');
var fs   = require('fs');
var cssHelpers = require('./cssHelpers.js');
var colors = require('./colorHelpers.js')

var requestHandler = function (req, res) {
  console.log(req.method, 'request made for', req.url);
  manageFiles(req, res);
};

// -- HELPERS

var getContentType = function (requestedFile) {
  var parsed = requestedFile.split('.');
  var filetype = parsed[parsed.length-1];

  var contentTypes = {
    html: "text/html",
    htm: "text/html",
    css: "text/css",
    js: "application/javascript",
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    gif: "image/gif",
    png: "image/png"
  }

  var contentType = contentTypes[filetype] || 'text/plain';
  return contentType;
};

var methodHandler = {
  GET: function (rurl, res) {
    var file = url.parse(rurl).pathname;
    if (file === '/' || file === '') {
      file = '/index.html';
    }

    var data = fs.readFileSync( __dirname + '/client' + file );
    corsHeaders['content-type'] = getContentType(file);

    res.writeHead(200, corsHeaders);
    res.end(data);
  },
  getCSS: function (rurl, res) {
    downloadPage(rurl, res);
  }
};

var manageFiles = function (req, res) {
  if( req.url.split('=')[0] === '/?url' ){
    methodHandler.getCSS(unescape(req.url.split('=')[1]), res);
  } else {
    methodHandler[req.method](req.url, res);
  }
};

var downloadPage = function(rurl, res){
  console.log('Downloading html:', rurl);
  http.get(rurl, function(response){

    var pageData = '';
    response.on('data', function(chunk){
      pageData += chunk;
    });

    response.on('end', function () {
      savePage(pageData, rurl, res);
    });
  })
};

var savePage = function (page, rurl, res) {
  var localFile = __dirname + '/res/' + 'page.txt';
  fs.writeFile(localFile, page, function(err) {
    if( err ){
      console.log("Failed to create file for ", rurl);
    } else {
      console.log(localFile + " created.");
      cssHelpers.identifyCSS(localFile, rurl, res);
    }
  });
};

exports.returnData = function (res, data) {
  for (var i = 0; i < data.colors.length; i++) {
    data.colors[i] = colors.rgbToHex(data.colors[i]);
  };
  console.log('returning colors', data.colors, 'and fonts', data.fonts);
  var headers = corsHeaders;
  res.writeHead(200, headers);
  res.end(JSON.stringify(data));
}

// -- HELPERS

exports.unique = function (array) {
  for (var i = 0; i < array.length; i++) {
    if (array.indexOf(array[i], i+1) !== -1){
      array.splice(i, 1);
      i--;
    }
  }
  return array;
}

// Lo-Dash: The cure for your async headaches
exports.after = function (n, func) {
  return function() {
    if (--n < 1) {
      return func.apply(this, arguments);
    }
  };
};

// -- CORS!

var corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

// -- SERVER SETUP

var port = process.env.PORT || 8080;
var server = http.createServer(requestHandler);
console.log('Listening on port:', port);
server.listen(port);