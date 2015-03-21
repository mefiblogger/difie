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
        return text.replace("<", "&lt;").replace(">", "&gt;");
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
                if (right[i] != left[openPos]) {
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
     * @param {string}      urlLeft
     * @param {string}      responseLeft
     * @param {string}      urlRight
     * @param {string}      responseRight
     * @param {function}    callback
     */
    var diff = function (urlLeft, responseLeft, urlRight, responseRight, callback) {
        var diff = [],
            left = responseLeft.split("\n"),
            right = responseRight.split("\n"),
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
            left: responseLeft,
            right: responseRight
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
        request({ url: urlLeft }, function (errorLeft, responseLeft) {
            if (!responseLeft) {
                callback("Failed to load LEFT URL: " + urlLeft, null);
                return;
            }

            request({ url: urlRight }, function (errorRight, responseRight) {
                if (!responseRight) {
                    callback("Failed to load RIGHT URL: " + urlRight, null);
                    return;
                }

                diff(urlLeft, responseLeft.body, urlRight, responseRight.body, callback);
            });
        });
    };

    return {
        start: start
    };
};
