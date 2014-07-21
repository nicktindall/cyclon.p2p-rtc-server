'use strict';

require("newrelic")
var http = require("http");
var express = require("express");
var io = require("socket.io");
var bodyParser = require("body-parser");
var PeerNotifier = require("./lib/PeerNotifier");
var PeerApi = require("./lib/PeerApi");

var DEFAULT_PORT = 2222;

var app = express();
app.use(bodyParser.json());

//
// Allow CORS for all resources
//
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	next();
});

// Create the server
var server = http.createServer(app);

var socketio = io.listen(server);
var peerNotifier = new PeerNotifier(socketio);
new PeerApi(app, peerNotifier);

//
// Start the server
//
server.listen(process.env.PORT || DEFAULT_PORT);
