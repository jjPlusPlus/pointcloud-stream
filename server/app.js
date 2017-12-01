const http = require('http');
const express = require('express');
const app = express();
const server = http.createServer(app);
const io = require('socket.io').listen(server);
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.get('/', function (request, response) {
  response.sendStatus(200);
});

/* request will be a JSON array of point objects, each having an x, y, and z attribute */
app.post('/sendPoints', function (request, response) {
  // stream the points down to any subscribed clients
  io.emit('points', request.body);
  response.sendStatus(200);
});

io.on('connection', function (socket) {
  socket.emit('private', { msg: 'successful connection' });

  socket.on('private', function (data) {
    console.log(data);
  });

  socket.on('connect', function (lol) {
    console.log('lol');
  });

  socket.on('disconnect', function () {
    // nothing to do here
  });
});

server.listen(3000);
