'use strict';

var express = require("express");

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
            res.send(200, peerNotifier.samplePeers(req.param('room'), nullSafeParse(req.param('limit'))));
        }
        else {
            res.send(400, '"room" parameter must be specified');
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
            res.send(201);
        }
        catch (error) {
            res.send(404, error.message);
        }
    }
    else {
        var errorText = "Bad " + messageType + " message received: " + JSON.stringify(req.body);
        console.error(errorText);
        res.send(400, errorText);
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
