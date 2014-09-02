'use strict';

module.exports = function (maxAge) {

    /**
     * Add the CORS headers
     */
    return function (req, res, next) {
        res.header("Access-Control-Allow-Origin", "*");
        res.header("Access-Control-Allow-Headers", "Content-Type");
        if (maxAge) {
            res.header("Access-Control-Max-Age", String(maxAge));
        }
        next();
    };
};