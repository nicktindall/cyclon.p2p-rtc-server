'use strict';

var PeerNotifier = require("../lib/PeerNotifier");

describe("The peer notifier", function () {

    var DESTINATION_ID = "destination";
    var MESSAGE_TYPE = "messageType";
    var MESSAGE = "message";
    var ROOM = "room";
    var LIMIT = "limit";

    var roomManager,
        registrationManager,
        peerNotifier,
        socketIoServer,
        peersNamespace,
        socket;

    beforeEach(function () {
        roomManager = jasmine.createSpyObj('roomManager', ['samplePeers']);
        registrationManager = jasmine.createSpyObj('registrationManager', ['getPointer', 'getSocket']);
        socketIoServer = jasmine.createSpyObj('socket.io', ['of']);
        peersNamespace = jasmine.createSpyObj('socket.io socket', ['on']);
        socketIoServer.of.and.returnValue(peersNamespace);
        socket = jasmine.createSpyObj('clientSocket', ['emit']);

        peerNotifier = new PeerNotifier(socketIoServer, registrationManager, roomManager);
    });

    describe("when initializing", function () {

        it("should start listening for connections on '/peers'", function () {
            expect(socketIoServer.of).toHaveBeenCalledWith("/peers");
            expect(peersNamespace.on).toHaveBeenCalledWith("connection", jasmine.any(Function));
        });
    });

    describe("when sending a message to a peer", function () {

        describe("and the peer is currently registered", function () {

            beforeEach(function () {
                registrationManager.getSocket.and.returnValue(socket);
            });

            it("will send the received message on the socket", function () {
                peerNotifier.sendMessageToPeer(DESTINATION_ID, MESSAGE_TYPE, MESSAGE);
                expect(socket.emit(MESSAGE_TYPE, MESSAGE));
            });
        });

        describe("and the peer is currently unregistered", function () {

            it("will throw an error", function () {
                expect(function () {
                    peerNotifier.sendMessageToPeer(DESTINATION_ID, MESSAGE_TYPE, MESSAGE);
                }).toThrow();
            });
        });
    });

    describe("when sampling peers", function () {

        it("will delegate to the room manager, then fetch pointers from the registration manager", function () {
            var pointers = ["firstPointer", "secondPointer", "thirdPointer"];
            var counter = 0;
            roomManager.samplePeers.and.returnValue(["one", "two", "three"]);
            peerNotifier.samplePeers(ROOM, LIMIT);

            registrationManager.getPointer.and.callFake(function() {
                return pointers[counter++];
            });

            expect(peerNotifier.samplePeers(ROOM, LIMIT)).toEqual({
                "one": "firstPointer",
                "two": "secondPointer",
                "three": "thirdPointer"
            });
        });
    });
});