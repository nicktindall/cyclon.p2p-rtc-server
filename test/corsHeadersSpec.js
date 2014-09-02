'use strict';

var corsHeaders = require("../lib/corsHeaders");

describe("the CORS header applier", function() {

    var response,
        next;

    beforeEach(function() {
        response = jasmine.createSpyObj('response', ['header']);
        next = jasmine.createSpy('next');
    });

    it("applies the allow-origin and allow-headers headers then calls next", function() {
        var headers = corsHeaders();
        headers(null, response, next);
        expect(response.header).toHaveBeenCalledWith("Access-Control-Allow-Origin", "*");
        expect(response.header).toHaveBeenCalledWith("Access-Control-Allow-Headers", "Content-Type");
        expect(response.header).not.toHaveBeenCalledWith("Access-Control-Max-Age", jasmine.any(String));
        expect(next).toHaveBeenCalledWith();
    });

    it("applies the max-age header when max age is specified", function() {
        var headers = corsHeaders(12345);
        headers(null, response, next);
        expect(response.header).toHaveBeenCalledWith("Access-Control-Max-Age", "12345");
    });
});