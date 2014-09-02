'use strict';

var SessionEventHandler = require("./SessionEventHandler");
var Utils = require("cyclon.p2p-common");

function PeerNotifier(socketio, registrationManager, roomManager) {

    Utils.checkArguments(arguments, 3);

    socketio.of("/peers")
        .on('connection', function (socket) {
            new SessionEventHandler(registrationManager, roomManager).handleSession(socket);
        });

    /**
     * Send a message to a peer via its notification channel
     *
     * @param destinationId
     * @param messageType
     * @param message
     */
    this.sendMessageToPeer = function (destinationId, messageType, message) {
        var socket = registrationManager.getSocket(destinationId);

        if (socket) {
            socket.emit(messageType, message);
        }
        else {
            throw new Error("No client with specified ID found!");
        }
    };

    /**
     * Get a sample of peers from a room
     *
     * @param room
     * @param limit
     */
    this.samplePeers = function (room, limit) {
        var result = {};
        roomManager.samplePeers(room, limit).forEach(function (id) {
            result[id] = registrationManager.getPointer(id);
        });
        return result;
    }
}

module.exports = PeerNotifier;