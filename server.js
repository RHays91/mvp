var express = require('express');

var app = express();

app.use(express.static(__dirname + '/public'));

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  // "access-control-max-age": 10, // Seconds.
  'Content-Type': "text/html"
};

var sendResponse = function(res, data, statusCode){
  statusCode = statusCode || 200;
  res.writeHead(statusCode, headers);
  res.end(JSON.stringify(data));
};

app.get('/index.html', function (req, res) {
  sendResponse(res);
});

console.log('App listening on 3000');
app.listen(3000);