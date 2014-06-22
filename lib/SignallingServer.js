'use strict';

var http = require("http");
var express = require("express");
var io = require("socket.io");
var bodyParser = require("body-parser");
var PeerNotifier = require("./PeerNotifier");
var PeerApi = require("./PeerApi");

var DEFAULT_PORT = 2222;

/**
 * The signalling server
 */
function startSignallingServer() {

    if (process.argv.length < 3) {
        console.error("Error, usage: node SignallingServer /path/to/static/files");
        process.exit(1);
    }

    var app = express();
    app.use(bodyParser());

    // Serve static content
    app.use(express.static(process.argv[2]));

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
}

startSignallingServer();