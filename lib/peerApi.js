'use strict';

var express = require("express");
var PLAIN_TEXT = "text/plain";

function createApiForNotifier(peerNotifier) {
    var peerApi = express.Router();

    //
    // Handle offers
    //
    peerApi.post("/offer", function (req, res, next) {
        handleMessageSendRequest(peerNotifier, "offer", req, res);
    });

    //
    // Handle answers
    //
    peerApi.post("/answer", function (req, res) {
        handleMessageSendRequest(peerNotifier, "answer", req, res);
    });

    //
    // Handle candidates
    //
    peerApi.post("/candidates", function (req, res) {
        handleMessageSendRequest(peerNotifier, "candidates", req, res);
    });

    //
    // Return a random sample of the registered peers
    //
    peerApi.get("/peers", function (req, res, next) {

        if (req.param('room')) {
            res.status(200)
                .send(peerNotifier.samplePeers(req.param('room'), nullSafeParse(req.param('limit'))));
        }
        else {
            res.status(400)
                .type(PLAIN_TEXT)
                .send('"room" parameter must be specified');
        }
    });

    return peerApi;
}

/**
 * Attempt to deliver an 'offer'/'answer'/'candidates' message using the peer notifier
 *
 * @param peerNotifier
 * @param messageType
 * @param req
 * @param res
 */
function handleMessageSendRequest(peerNotifier, messageType, req, res) {
    if (req.body.destinationId) {
        try {
            peerNotifier.sendMessageToPeer(req.body.destinationId, messageType, req.body);
            res.status(201)
                .type(PLAIN_TEXT)
                .send("Message delivered");
        }
        catch (error) {
            res.status(404)
                .type(PLAIN_TEXT)
                .send(error.message);
        }
    }
    else {
        var errorText = "Bad " + messageType + " message received: " + JSON.stringify(req.body);
        console.error(errorText);
        res.status(400)
            .type(PLAIN_TEXT)
            .send(errorText);
    }
}

function nullSafeParse(paramValue) {
    try {
        if (paramValue) {
            return parseInt(paramValue);
        }
        return null;
    }
    catch (e) {
        return null;
    }
}

module.exports.createApiForNotifier = createApiForNotifier;
