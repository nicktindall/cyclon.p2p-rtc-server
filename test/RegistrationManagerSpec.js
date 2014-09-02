'use strict';

var RegistrationManager = require("../lib/RegistrationManager");

describe("The registration manager", function() {

    var SOCKET_ID_1 = "one";
    var SOCKET_ID_2 = "two";
    var SOCKET_1 = "SOCKET1";
    var SOCKET_2 = "SOCKET2";

    var registrations;

    beforeEach(function() {
        registrations = new RegistrationManager();
    });

    it("will store a registration and make its pointer and socket available", function() {

        registrations.register({id: SOCKET_ID_1}, SOCKET_1);
        registrations.register({id: SOCKET_ID_2}, SOCKET_2);

        expect(registrations.getPointer(SOCKET_ID_1)).toEqual({id: SOCKET_ID_1});
        expect(registrations.getPointer(SOCKET_ID_2)).toEqual({id: SOCKET_ID_2});

        expect(registrations.getSocket(SOCKET_ID_1)).toEqual(SOCKET_1);
        expect(registrations.getSocket(SOCKET_ID_2)).toEqual(SOCKET_2);
    });

    it("will no return undefined for sockets or pointers after a registration is unregistered", function() {
        registrations.register({id: SOCKET_ID_1}, SOCKET_1);

        expect(registrations.getPointer(SOCKET_ID_1)).toEqual({id: SOCKET_ID_1});
        expect(registrations.getSocket(SOCKET_ID_1)).toEqual(SOCKET_1);

        registrations.unregister(SOCKET_ID_1);

        expect(registrations.getPointer(SOCKET_ID_1)).toBeUndefined();
        expect(registrations.getSocket(SOCKET_ID_1)).toBeUndefined();
    });
});