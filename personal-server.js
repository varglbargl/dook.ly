var http = require('http');
var path = require('path');
var url  = require('url');
var fs   = require('fs');

// File server, like as in a thing that serves files.
var requestHandler = function (req, res) {
  console.log(req.method, 'request made for', req.url);
  var headers = defaultCorsHeaders;
  manageStaticFiles(req, res, headers);
};

var manageStaticFiles = function (req, res, headers) {
  var requestedFile = url.parse(req.url).pathname;
  var statusCode = 200;

  if (requestedFile === '/' || requestedFile === '') {
    requestedFile = '/index.html'
  }

  headers['content-type'] = getContentType(requestedFile);

  fs.readFile( __dirname + requestedFile, function (err, data) {
    if (err) {
      statusCode = 404;
      res.end('CRITICAL MISS!');
    }
    res.writeHead(statusCode, headers);
    res.end(data);
  });

};

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

// CORS!
var defaultCorsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

// Setup server
var port = 8080;
var ip = '127.0.0.1';
var server = http.createServer(requestHandler);

console.log('Listening on http://' + ip + ':' + port);
server.listen(port, ip);