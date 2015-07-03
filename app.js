var express = require('express'),
    firmata = require("firmata"),
    http =require('http'),
    socketio = require('socket.io');

var app = express(),
    serverIO = http.createServer(app),
    io = socketio.listen(serverIO),
    board;

var ledPin = 13,
    comPort = "COM11",
    serverPort = 3000;

initArduino(initServer);

function initArduino(callback){
  console.log("blink start ...");
  board = new firmata.Board(comPort, function(err) {
    if (err) {
      console.log(err);
      return;
    }
    console.log("connected");
    callback();
  });
}

function initServer(){
  app.use(express.static('public'));

  io.on('connection', function (socket) {
    socket.on('turn', function (data) {
         turnLed(data.turn);
    });
  });

  var server = serverIO.listen(serverPort, function () {
    var host = server.address().address;
    var port = server.address().port;
    console.log('Example app listening at http://%s:%s', host, port);
  });
}

function turnLed(turn){
    board.pinMode(ledPin, board.MODES.OUTPUT);
    if (turn == "on") {
      board.digitalWrite(ledPin, board.HIGH);
    } else if (turn == "off"){
      board.digitalWrite(ledPin, board.LOW);
    }
}
