'use strict';

function RegistrationManager() {

    var sockets = {};
    var registrations = {};

    this.unregister = function (nodeId) {
        delete sockets[nodeId];
        delete registrations[nodeId];
    };

    this.register = function (pointer, socket) {
        sockets[pointer.id] = socket;
        registrations[pointer.id] = pointer;
    };

    this.getSocket = function (nodeId) {
        return sockets[nodeId];
    };

    this.getPointer = function (nodeId) {
        return registrations[nodeId];
    };
}

module.exports = RegistrationManager;