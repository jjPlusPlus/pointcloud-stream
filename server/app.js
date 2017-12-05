const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');
const multiparty = require('multiparty');
const fs = require('fs-extra');

var jsonParserOfficial = bodyParser.json();

// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.get('/', function (request, response) {
  response.sendStatus(200);
});

/* request will be a JSON array of point objects, each having an x, y, and z attribute */
app.post('/sendPoints', jsonParserOfficial, function (request, response) {
  // stream the points down to any subscribed clients
  io.emit('points', request.body);
  response.sendStatus(200);
});

/* request will be a JSON "floor" attribute with a float-precision value */
app.post('/setFloor', jsonParserOfficial, function (request, response) {
  // updates the floor level on the client
  io.emit('setFloor', request.body);
  response.sendStatus(200);
});

/* request will be a large ZIP file of images */
app.post('/transferImages', function (request, response) {
  // content-type: application/octet-stream
  // transfer by stream/pipe large zip file to the client for download

  var form = new multiparty.Form();

  form.parse(request, function (err, fields, files) {
    const filepath = files.archive[0].path;
    fs.move(filepath, '/Users/jjPlusPlus/Desktop/archive.zip');

    io.emit('saveImages', filepath);
    response.sendStatus(200);
  });
});

io.on('connection', function (socket) {
  socket.emit('private', { msg: 'successful connection' });

  socket.on('private', function (data) {
    // private connections placeholder
  });

  socket.on('connect', function (lol) {
    // nothing to do here
  });

  socket.on('disconnect', function () {
    // nothing to do here
  });
});

server.listen(3000);
