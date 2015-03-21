/*global require, module, console */
/*jslint unparam: true, sloppy: true, vars: true */

var request = require("request");

module.exports = function () {

    /**
     * Replaces the < and > characters with &lt; and &gt; strings.
     *
     * @param {string}  text
     *
     * @returns {string}
     */
    var clear = function (text) {
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    };

    /**
     * Highlights the character differencies with a span element.
     *
     * @param {string}  left
     * @param {string}  right
     *
     * @returns {string}
     */
    var highlight = function (left, right) {
        var length = left.length || 0,
            i,
            highlighted = "",
            lastMatchingPosition = 0,
            open = false;

        for (i = 0; i <= length; i++) {
            if (right.hasOwnProperty(i)) {
                if (right[i] != left[lastMatchingPosition]) {
                    if (!open) {
                        highlighted += "<span class='diff'>";
                        open = true;
                        lastMatchingPosition = i;
                    }
                } else {
                    if (0 < open) {
                        highlighted += "</span>";
                        open = false;
                    }
                    lastMatchingPosition++;
                }
                highlighted += right[i];
            }
        }

        return highlighted;
    };

    /**
     * Collects the different lines of two given string
     * and returns it within the given callback.
     *
     * @param {object}      data
     * @param {function}    callback
     */
    var diff = function (data, callback) {
        var diff = [],
            left = data.responseLeft.body.split("\n"),
            right = data.responseRight.body.split("\n"),
            lineLeft,
            lineRight,
            lines,
            i;

        lines = (left.length > right.length ? left.length : right.length);

        for (i = 0; i <= lines; i++) {
            lineLeft = (left.hasOwnProperty(i) ? left[i] : "");
            lineRight = (right.hasOwnProperty(i) ? right[i] : "");

            if (lineLeft != lineRight) {
                diff.push({
                    line: i + 1,
                    left: clear(lineLeft),
                    right: highlight(clear(lineLeft), clear(lineRight))
                });
            }
        }

        callback(false, {
            diff: diff,
            data : data
        });
    };

    /**
     * Downloads the two given URL and collects
     * the different lines, returns it within
     * the given callback.
     *
     * @param {string}      urlLeft
     * @param {string}      urlRight
     * @param {function}    callback
     */
    var start = function (urlLeft, urlRight, callback) {
        var start = Date.now(),
            responseTimeLeft,
            responseTimeRight;


        request({ url: urlLeft }, function (errorLeft, responseLeft) {
            responseTimeLeft = Date.now() - start;

            if (!responseLeft) {
                callback("Failed to load LEFT URL: " + urlLeft, null);
                return;
            }

            start = Date.now();

            request({ url: urlRight }, function (errorRight, responseRight) {
                responseTimeRight = Date.now() - start;

                if (!responseRight) {
                    callback("Failed to load RIGHT URL: " + urlRight, null);
                    return;
                }

                diff({
                    urlLeft : urlLeft,
                    responseLeft: responseLeft,
                    responseTimeLeft: responseTimeLeft,
                    urlRgiht: urlRight,
                    responseRight: responseRight,
                    responseTimeRight: responseTimeRight,
                }, callback);
            });
        });
    };

    return {
        start: start
    };
};
