'use strict';

var RoomManager = require("../lib/RoomManager.js");

describe("The room manager", function() {

    var roomManager;
    var PEER_ID_ONE = "ONE";
    var PEER_ID_TWO = "TWO";

    var ROOM_ONE = "ROOM_ONE";
    var ROOM_TWO = "ROOM_TWO";

    beforeEach(function() {
        roomManager = new RoomManager(10, 100);
    });

    it("will subscribe a pointer to a room", function() {
        roomManager.updateRooms(PEER_ID_ONE, null, [ROOM_ONE]);
        expect(roomManager.samplePeers(ROOM_ONE, 1)).toEqual([PEER_ID_ONE]);
    });

    it("will remove a pointer from a room", function() {
        roomManager.updateRooms(PEER_ID_ONE, null, [ROOM_ONE]);
        roomManager.updateRooms(PEER_ID_TWO, null, [ROOM_ONE]);
        var sample = roomManager.samplePeers(ROOM_ONE, 2);
        expect(sample).toContain(PEER_ID_ONE);
        expect(sample).toContain(PEER_ID_TWO);
        roomManager.updateRooms(PEER_ID_ONE, [ROOM_ONE], null);
        expect(roomManager.samplePeers(ROOM_ONE, 2)).toEqual([PEER_ID_TWO]);
    });

    it("will change the rooms a pointer is in", function() {
        expect(roomManager.samplePeers(ROOM_ONE, 10)).toEqual([]);
        expect(roomManager.samplePeers(ROOM_TWO, 10)).toEqual([]);
        roomManager.updateRooms(PEER_ID_ONE, null, [ROOM_ONE]);
        expect(roomManager.samplePeers(ROOM_ONE, 10)).toEqual([PEER_ID_ONE]);
        expect(roomManager.samplePeers(ROOM_TWO, 10)).toEqual([]);
        roomManager.updateRooms(PEER_ID_ONE, [ROOM_ONE], [ROOM_TWO]);
        expect(roomManager.samplePeers(ROOM_ONE, 10)).toEqual([]);
        expect(roomManager.samplePeers(ROOM_TWO, 10)).toEqual([PEER_ID_ONE]);
    });

    it("will limit samples by the specified amount", function() {
        roomManager.updateRooms(PEER_ID_ONE, null, [ROOM_ONE]);
        roomManager.updateRooms(PEER_ID_TWO, null, [ROOM_ONE]);
        expect(roomManager.samplePeers(ROOM_ONE, 1).length).toBe(1);
    });

    it("will return true to roomExists when there is at least one peer in it", function() {
        expect(roomManager.roomExists(ROOM_ONE)).toBe(false);
        roomManager.updateRooms(PEER_ID_ONE, null, [ROOM_ONE]);
        expect(roomManager.roomExists(ROOM_ONE)).toBe(true);
        roomManager.updateRooms(PEER_ID_ONE, [ROOM_ONE], null);
        expect(roomManager.roomExists(ROOM_ONE)).toBe(false);
    });

    it("will default the limit when it is not a number", function() {
        var lowDefaultLimitRoomManager = new RoomManager(1, 100);
        lowDefaultLimitRoomManager.updateRooms(PEER_ID_ONE, null, [ROOM_ONE]);
        lowDefaultLimitRoomManager.updateRooms(PEER_ID_TWO, null, [ROOM_ONE]);
        expect(lowDefaultLimitRoomManager.samplePeers(ROOM_ONE).length).toBe(1);
    });

    it("will throw an error when no room is specified", function() {
        expect(function() {
            roomManager.samplePeers()
        }).toThrow();
    });
});