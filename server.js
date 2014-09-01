'use strict';

require("newrelic");

var http = require("http");
var express = require("express");
var io = require("socket.io");
var bodyParser = require("body-parser");
var PeerNotifier = require("./lib/PeerNotifier");
var peerApi = require("./lib/peerApi");

var DEFAULT_PORT = 2222;

var app = express();
app.use(bodyParser.json());

//
// Allow CORS for all resources
//
app.use(function(req, res, next) {
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "Content-Type");
	res.header("Access-Control-Max-Age", "1728000");
	next();
});

// Create the server
var server = http.createServer(app);

var socketio = io.listen(server);
var peerNotifier = new PeerNotifier(socketio);
app.use("/api", peerApi.createApiForNotifier(peerNotifier));

//
// Start the server
//
var port = process.env.PORT || DEFAULT_PORT;
server.listen(port);
console.log("Started server on port " + port);
