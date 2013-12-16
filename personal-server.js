var http = require('http');
var path = require('path');
var url  = require('url');
var fs   = require('fs');

// -- FILE SERVER

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
    console.log('attempting to get CSS for', rurl);
    downloadPage(rurl, res);
  }
};

var manageFiles = function (req, res) {
  var statusCode = 200;
  if( req.url.split('=')[0] === '/?url' ){
    methodHandler.getCSS(unescape(req.url.split('=')[1]), res);
  } else {
    methodHandler[req.method](req.url, res);
  }
};

var downloadPage = function(rurl, res){
  console.log(url.parse(rurl));
  console.log('Downloading html:', rurl);
  http.get(rurl, function(response){

    var pageData = '';
    response.on('data', function(chunk){
      pageData += chunk;
    });

    response.on('end', function () {
      //console.log(url)
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
      identifyCSS(localFile, rurl);
    }
  });
};

var identifyCSS = function (file, rurl, res) {
  console.log('Attempting to identify css of', file);
  var html = fs.readFileSync(file);

  // console.log(unescape(html.toString()));

  var scriptTag = html.toString().split('.css')[0];

  if (scriptTag.length > 1) {
    scriptTag = scriptTag.split('href=');
    scriptTag = scriptTag[scriptTag.length-1];
  }

  var css = ((scriptTag+'.css').replace("'", '').replace('"', ''));
  var cssURL = url.resolve(rurl, css);
  console.log('URL of CSS file believed to be', cssURL);
  downloadCSS(cssURL, rurl, res);
};

var downloadCSS = function(rurl, res){
  console.log(url.parse(rurl));
  console.log('Downloading css:', rurl);
  http.get(rurl, function(response){

    var cssData = '';
    response.on('data', function(chunk){
      cssData += chunk;
    });

    response.on('end', function () {
      //console.log(url)
      saveCSS(cssData, rurl, res);
    });
  })
};

var saveCSS = function (file, rurl, res) {
  var localFile = __dirname + '/res/' + 'css.txt';
  fs.writeFile(localFile, file, function(err) {
    if( err ){
      console.log("Failed to create file for ", rurl);
    } else {
      mineCSS(localFile, res);
      console.log(localFile + " created.");
    }
  });
}

var mineCSS = function (file, res) {
  
  var results = {colors:[], fonts:[]};

  assembleColorPalette(results.colors);
  // something with the fonts.
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
  console.log(distinctHues);
  return distinctHues;
};

var rgbToHex = function (rgb) {
  rgb = rgb.split(',');
  var r = parseInt(rgb[0].split('(')[1]);
  var g = parseInt(rgb[1]);
  var b = parseInt(rgb[2].split(')')[0]);

  return '#' + ('000000' + ((r << 16) | (g << 8) | b).toString(16)).slice(-6);
};

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

// var downloadImage = function(rurl, res){
//   console.log(url.parse(rurl));
//   console.log('Downloading ', rurl);
//   http.get(rurl, function(response){

//     var imageData = '';
//     response.on('data', function(chunk){
//       imageData += chunk;
//     });

//     response.on('end', function () {
//       //console.log(url)
//       saveImage(imageData, rurl, res);
//     });
//   })
// };

// var serveImage = function (file) {
//   return false;
// };

// var saveImage = function (image, rurl, res) {
//   var filetype = url.parse(rurl).pathname.split('.')[url.parse(rurl).pathname.split('.').length-1];
//   console.log(filetype, url.parse(rurl).pathname)
//   var localFile = __dirname + '/res/' + 'image.' + filetype;
//   fs.writeFile(localFile, image, function(err) {
//     if( err ){
//       console.log("Failed to create file for ", file);
//     } else {
//       serveImage('image' + filetype, localFile);
//       // document.write(file + " created.");
//     }
//   });
// };

// -- CORS!

var corsHeaders = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10 // Seconds.
};

// Setup server
var port = process.env.PORT || 8080;
var server = http.createServer(requestHandler);
console.log('Listening on port:', port);
server.listen(port);