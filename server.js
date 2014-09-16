'use strict';


var http = require("http");
var express = require("express");
var io = require("socket.io");
var bodyParser = require("body-parser");
var PeerNotifier = require("./lib/PeerNotifier");
var peerApi = require("./lib/peerApi");
var corsHeaders = require("./lib/corsHeaders");
var RoomManager = require("./lib/RoomManager");
var RegistrationManager = require("./lib/RegistrationManager");

var DEFAULT_LIMIT = 10;
var MAX_LIMIT = 50;
var DEFAULT_PORT = 2222;

var registraitionManager = new RegistrationManager();
var roomManager = new RoomManager(DEFAULT_LIMIT, MAX_LIMIT);

var app = express();
app.use(bodyParser.json());

// Allow CORS for all resources
app.use(corsHeaders(1728000));

// Create the server
var server = http.createServer(app);

var socketio = io.listen(server);
var peerNotifier = new PeerNotifier(socketio, registraitionManager, roomManager);
app.use("/api", peerApi.createApiForNotifier(peerNotifier));

//
// Start the server
//
var port = process.env.PORT || DEFAULT_PORT;
server.listen(port);
console.log("Started server on port " + port);
