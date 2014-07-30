'use strict';

var Utils = require("cyclon.p2p").Utils;
var RoomManager = require("./RoomManager");

var DEFAULT_LIMIT = 10;
var MAX_LIMIT = 50;


function PeerNotifier(socketio) {

    var idToSocketMapping = {};
    var registrations = {};
    var rooms = new RoomManager(DEFAULT_LIMIT, MAX_LIMIT);

    socketio.of("/peers")
        .on('connection', function (socket) {

            var connectedId = null;
            var currentRooms = [];

            /**
             * When the client disconnects, clean up the associated state
             */
            socket.on('disconnect', function () {
                if (connectedId !== null) {
                    rooms.updateRooms(connectedId, currentRooms, null);
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

            /**
             * The first thing a peer does when it connects is "register"
             * to identify itself. It cannot receive messages unit it has
             * registered.
             */
            socket.on("join", function (roomsToJoin) {

                // Check that the peer has registered first
                if (connectedId === null) {
                    throw new Error("You can't join rooms before registering!");
                }

                rooms.updateRooms(connectedId, currentRooms, roomsToJoin);
                currentRooms = roomsToJoin;
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
     * Get a sample of peers from a room
     *
     * @param room
     * @param limit
     */
    this.samplePeers = function(room, limit) {
        var result = {};
        rooms.samplePeers(room, limit).forEach(function(id) {
            result[id] = registrations[id];
        });
        return result;
    }
}

module.exports = PeerNotifier;