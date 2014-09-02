'use strict';

var events = require("events");
var SessionEventHandler = require("../lib/SessionEventHandler");

describe("The session event handler", function() {

    var NODE_POINTER_1 = {
        id: "one"
    };
    var NODE_POINTER_2 = {
        id: "two"
    };
    var ROOMS_LIST = ["aaa", "bbb"];
    var OTHER_ROOMS_LIST = ["ccc"];

    var roomManager,
        registrationManager,
        socket,
        eventHandler;

    beforeEach(function() {
        roomManager = jasmine.createSpyObj('roomManager', ['updateRooms']);
        registrationManager = jasmine.createSpyObj('registrationManager', ['unregister', 'register']);
        socket = new events.EventEmitter();
        eventHandler = new SessionEventHandler(registrationManager, roomManager);
        eventHandler.handleSession(socket);
    });

    describe("when a register message is received", function() {

        it("delegates to the registration manager", function () {
            socket.emit("register", NODE_POINTER_1);
            expect(registrationManager.register).toHaveBeenCalledWith(NODE_POINTER_1, socket);
        });

        describe("after an initial registration", function() {

            it("will update the registration in the registration manager", function() {
                socket.emit("register", NODE_POINTER_1);
                expect(registrationManager.register).toHaveBeenCalledWith(NODE_POINTER_1, socket);
                var updatedPointerOne = {
                    id: NODE_POINTER_1.id,
                    otherProperty: "otherValue"
                };
                socket.emit("register", updatedPointerOne);
                expect(registrationManager.register).toHaveBeenCalledWith(updatedPointerOne, socket);
            });

            it("will throw an error if the ID doesn't match the initial registration", function() {
                socket.emit("register", NODE_POINTER_1);
                expect(function() {
                    socket.emit("register", NODE_POINTER_2);
                }).toThrow();
            });
        });
    });

    describe("when a join message is received", function() {

        it("updates the room membership in the room manager", function () {
            socket.emit("register", NODE_POINTER_1);
            socket.emit("join", ROOMS_LIST);
            expect(roomManager.updateRooms).toHaveBeenCalledWith(NODE_POINTER_1.id, [], ROOMS_LIST);
        });

        it("throws an error if the node hasn't pre-registered", function () {
            expect(function () {
                socket.emit("join", ROOMS_LIST);
            }).toThrow();
        });

        it("leaves the current rooms and joins the new ones after the first join", function() {
            socket.emit("register", NODE_POINTER_1);
            socket.emit("join", ROOMS_LIST);
            socket.emit("join", OTHER_ROOMS_LIST);
            expect(roomManager.updateRooms).toHaveBeenCalledWith(NODE_POINTER_1.id, ROOMS_LIST, OTHER_ROOMS_LIST);
        });
    });

    describe("when a disconnect message is received", function() {

        describe("and the socket is registered and has joined rooms", function() {

            beforeEach(function() {
                socket.emit("register", NODE_POINTER_1);
                socket.emit("join", ROOMS_LIST);
                socket.emit("disconnect");
            });

            it("updates the room and registration managers", function() {
                expect(roomManager.updateRooms(NODE_POINTER_1.id, ROOMS_LIST, []));
                expect(registrationManager.unregister(NODE_POINTER_1.id));
            });
        });

        describe("and the socket had not yet registered", function() {

            beforeEach(function() {
                socket.emit("disconnect");
            });

            it("doesn't update the rooms or registrations", function() {
                expect(roomManager.updateRooms).not.toHaveBeenCalled();
                expect(registrationManager.unregister).not.toHaveBeenCalled();
            });
        });
    });
});