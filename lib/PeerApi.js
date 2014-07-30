'use strict';

var express = require("express");

function PeerApi(expressApp, peerNotifier) {

    var router = express.Router();
    var requests = 0;

    //
    // Count invocations
    //
    router.use(function (req, res, next) {
        requests++;
        next();
    });

    //
    // Handle offers
    //
    router.post("/offer", function (req, res, next) {

        if (req.body.destinationId) {
            try {
                peerNotifier.sendMessageToPeer(req.body.destinationId, "offer", req.body);
                res.send(201);
            }
            catch (error) {
                res.send(404, error.message);
            }
        }
        else {
            var errorText = "Bad offer received: " + JSON.stringify(req.body);
            console.error(errorText);
            res.send(400, errorText);
        }
    });

    //
    // Handle answers
    //
    router.post("/answer", function (req, res, next) {

        if (req.body.destinationId) {
            try {
                peerNotifier.sendMessageToPeer(req.body.destinationId, "answer", req.body);
                res.send(201);
            }
            catch (error) {
                res.send(404, error.message);
            }
        }
        else {
            var errorText = "Bad answer received: " + JSON.stringify(req.body);
            console.error(errorText);
            res.send(400, errorText);
        }
    });

    //
    // Handle answers
    //
    router.post("/candidates", function (req, res, next) {

        if (req.body.destinationId) {
            try {
                peerNotifier.sendMessageToPeer(req.body.destinationId, "candidates", req.body);
                res.send(201);
            }
            catch (error) {
                res.send(404, error.message);
            }
        }
        else {
            var errorText = "Bad candidates message received: " + JSON.stringify(req.body);
            console.error(errorText);
            res.send(400, errorText);
        }
    });

    //
    // Return a random sample of the registered peers
    //
    router.get("/peers", function (req, res, next) {

        res.send(200, peerNotifier.samplePeers(req.param('room'), parseInt(req.param('limit'))));
    });

    //
    // Register the router at /api
    //
    expressApp.use("/api", router);
}

module.exports = PeerApi;
