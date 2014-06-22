'use strict';

var Utils = require("cyclon.p2p").Utils;

var DEFAULT_LIMIT = 10;
var MAX_LIMIT = 50;


function PeerNotifier(socketio) {

    var idToSocketMapping = {};
    var registrations = {};

    socketio.of("/peers")
        .on('connection', function (socket) {

            var connectedId = null;

            /**
             * When the client disconnects, clean up the associated state
             */
            socket.on('disconnect', function () {
                if (connectedId !== null) {
                    delete idToSocketMapping[connectedId];
                    delete registrations[connectedId];
                }
                else {
                    console.log("Unknown socket disconnected " + socket.id);
                }
            });

            /**
             * The first thing a peer does when it connects is "register"
             * to identify itself. It cannot receive messages unit it has
             * registered.
             */
            socket.on("register", function (nodePointer) {

                // Check that a peer isn't trying to re-register as a different ID
                if (connectedId !== null && connectedId !== nodePointer.id) {
                    throw new Error("Peer tried to re-register as a different peer!");
                }

                connectedId = nodePointer.id;
                idToSocketMapping[connectedId] = socket;
                registrations[connectedId] = nodePointer;
            });
        });

    /**
     * Send a message to a peer via its notification channel
     *
     * @param destinationId
     * @param messageType
     * @param message
     */
    this.sendMessageToPeer = function (destinationId, messageType, message) {
        var socket = idToSocketMapping[destinationId];

        if (socket) {
            socket.emit(messageType, message);
        }
        else {
            throw new Error("No client with specified ID found!");
        }
    };

    /**
     * Randomly choose a subset of the registrations to return
     *
     * @param limit The limit requested
     */
    this.samplePeers = function (limit) {
        if (typeof(limit) !== "number") {
            limit = DEFAULT_LIMIT;
        }
        var response = {};
        Utils.randomSample(Object.keys(registrations), Math.min(MAX_LIMIT, limit)).forEach(function (id) {
            response[id] = registrations[id];
        });
        return response;
    };
}

module.exports = PeerNotifier;