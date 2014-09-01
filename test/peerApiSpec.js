'use strict';

var express = require("express");
var request = require("supertest");
var bodyParser = require("body-parser");
var peerApi = require("../lib/peerApi");

describe("The Peer API", function () {

    var VALID_MESSAGE = {
        destinationId: "c95d2314-3f1b-4179-ad65-b53cd647781a"
    };

    var NO_DESTINATION_MESSAGE = {
        sourceId: "something?"
    };


    var app,
        notifier;

    beforeEach(function () {
        app = express();
        app.use(bodyParser.json());
        notifier = jasmine.createSpyObj('peerNotifier', ['sendMessageToPeer', 'samplePeers']);
        app.use("/api", peerApi.createApiForNotifier(notifier));
    });

    describe("when handling an offer post", function () {

        it("delegates to the peer notifier", function (done) {
            request(app)
                .post("/api/offer")
                .send(VALID_MESSAGE)
                .expect(201)
                .end(function(err) {
                    expect(err).toBeFalsy();
                    expect(notifier.sendMessageToPeer).toHaveBeenCalledWith(
                        VALID_MESSAGE.destinationId,
                        "offer",
                        VALID_MESSAGE);
                    done();
                });
        });

        describe("and the destination ID is missing", function() {

            it("returns a 400 bad request and does not send the offer to any peer", function(done) {
                request(app)
                    .post("/api/offer")
                    .send(NO_DESTINATION_MESSAGE)
                    .expect(400)
                    .end(function(err) {
                        expect(err).toBeFalsy();
                        expect(notifier.sendMessageToPeer).not.toHaveBeenCalled();
                        done();
                    });
            });
        });

        describe("and the peer cannot be notified", function() {

            beforeEach(function() {
                notifier.sendMessageToPeer.and.throwError(new Error("peer not found"));
            });

            it("returns a 404 not found", function(done) {
                request(app)
                    .post("/api/offer")
                    .send(VALID_MESSAGE)
                    .expect(404)
                    .end(function(err) {
                        expect(err).toBeFalsy();
                        done();
                    });
            });
        });
    });

    describe("when handling an answer post", function () {

        it("delegates to the peer notifier", function (done) {
            request(app)
                .post("/api/answer")
                .send(VALID_MESSAGE)
                .expect(201)
                .end(function(err) {
                    expect(err).toBeFalsy();
                    expect(notifier.sendMessageToPeer).toHaveBeenCalledWith(
                        VALID_MESSAGE.destinationId,
                        "answer",
                        VALID_MESSAGE);
                    done();
                });
        });
    });

    describe("when handling a candidates post", function() {

        it("delegates to the peer notifier", function (done) {
            request(app)
                .post("/api/candidates")
                .send(VALID_MESSAGE)
                .expect(201)
                .end(function(err) {
                    expect(err).toBeFalsy();
                    expect(notifier.sendMessageToPeer).toHaveBeenCalledWith(
                        VALID_MESSAGE.destinationId,
                        "candidates",
                        VALID_MESSAGE);
                    done();
                });
        });
    });

    describe("when responding to a peer sampling request", function() {

        var ROOM_NAME = "CyclonWebRTC";
        var LIMIT = 132;

        var sampledPeers;

        beforeEach(function() {
            sampledPeers = [{
                    id: "XX"
                },{
                    id: "YY"
                }];

            notifier.samplePeers.and.returnValue(sampledPeers);
        });

        it("delegates to the peer notifier to retrieve the peers", function(done) {
            request(app)
                .get("/api/peers")
                .query({
                    room: ROOM_NAME,
                    limit: LIMIT
                })
                .expect(200, sampledPeers)
                .end(function(err) {
                    expect(err).toBeFalsy();
                    expect(notifier.samplePeers).toHaveBeenCalledWith(ROOM_NAME, LIMIT);
                    done();
                });
        });

        describe("and the room parameter is missing", function() {

            it("responds with a 400 bad request and doesn't try to sample peers", function(done) {
                request(app)
                    .get("/api/peers")
                    .query({
                        limit: LIMIT
                    })
                    .expect(400)
                    .end(function(err) {
                        expect(err).toBeFalsy();
                        expect(notifier.samplePeers).not.toHaveBeenCalled();
                        done();
                    });

            });
        });

        describe("and the limit parameter is missing", function() {

            it("passes null to the sampling function", function(done) {
                request(app)
                    .get("/api/peers")
                    .query({
                        room: ROOM_NAME
                    })
                    .expect(200, sampledPeers)
                    .end(function(err) {
                        expect(err).toBeFalsy();
                        expect(notifier.samplePeers).toHaveBeenCalledWith(ROOM_NAME, null);
                        done();
                    });

            });
        });
    });
});