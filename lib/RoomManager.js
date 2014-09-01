'use strict';

var Utils = require("cyclon.p2p-common");

function RoomManager(defaultLimit, maxLimit) {

    Utils.checkArguments(arguments, 2);

    var rooms = {};

    /**
     * Randomly choose a subset of the registrations to return
     *
     * @param limit The limit requested
     * @param room The "room" to sample from
     */
    this.samplePeers = function (room, limit) {
        if (!room) {
            throw new Error("Room to sample from must be specified");
        }

        if (typeof(limit) !== "number") {
            limit = defaultLimit;
        }

        if (rooms[room]) {
            return Utils.randomSample(Object.keys(rooms[room]), Math.min(maxLimit, limit));
        }
        return [];
    };

    /**
     * Update/set the "rooms" this pointer is a member of (if any)
     *
     * @param peerId
     * @param oldRooms
     * @param newRooms
     */
    this.updateRooms = function (peerId, oldRooms, newRooms) {

        // Delete pointer from my previous rooms (if any)
        if (oldRooms) {

            oldRooms.forEach(function (roomName) {
                delete rooms[roomName][peerId];

                // Delete room if it is empty
                if (Object.keys(rooms[roomName]).length == 0) {
                    delete rooms[roomName];
                }
            });
        }

        // Add pointer to current rooms
        if (newRooms) {
            newRooms.forEach(function (roomName) {

                // Create room if it doesn't exist
                if (!rooms.hasOwnProperty(roomName)) {
                    rooms[roomName] = {};
                }

                rooms[roomName][peerId] = true;
            });
        }
    };

    /**
     * Does the specified room exist (a room exists when there are peers in it)
     *
     * @param room
     * @returns {boolean}
     */
    this.roomExists = function(room) {
        return rooms.hasOwnProperty(room);
    };
}

module.exports = RoomManager;