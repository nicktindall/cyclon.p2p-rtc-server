'use strict';

/**
 * Handle the events, manage the state for a node session
 *
 * @param registrationManager
 * @param roomsManager
 * @constructor
 */
function SessionEventHandler(registrationManager, roomsManager) {

    this.handleSession = function(socket) {

        var connectedId = null;
        var currentRooms = [];

        /**
         * When the client disconnects, clean up the associated state
         */
        socket.on('disconnect', function () {
            if (connectedId !== null) {
                roomsManager.updateRooms(connectedId, currentRooms, null);
                registrationManager.unregister(connectedId);
            }
            else {
                console.log("Unknown socket disconnected " + socket.id);
            }
            socket.removeAllListeners();
            socket = null;
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
            registrationManager.register(nodePointer, socket);
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

            roomsManager.updateRooms(connectedId, currentRooms, roomsToJoin);
            currentRooms = roomsToJoin;
        });
    }
}

module.exports = SessionEventHandler;