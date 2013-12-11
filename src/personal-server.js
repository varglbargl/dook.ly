var http = require("http");
var port = 8082;
var ip = "127.0.0.1";
var server = http.createServer(handleRequest);

console.log("Listening on http://" + ip + ":" + port);
server.listen(port, ip);

var requestHandler = function (req, res) {
  
};