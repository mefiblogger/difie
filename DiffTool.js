/*global require, module, console */
/*jslint unparam: true, sloppy: true, vars: true */

var request = require("request");

module.exports = function () {

    var clear = function (text) {
        return text.replace("<", "&lt;").replace(">", "&gt;");
    };

    var highlight = function (left, right) {
        var length = left.length || 0,
            i,
            diff = "",
            openPos = 0;
            open = false;

        for (i = 0; i <= length; i++) {
            if (right.hasOwnProperty(i)) {
                if (right[i] != left[openPos]) {
                    if (!open) {
                        diff += "<span class='diff'>";
                        open = true;
                        openPos = i;
                    }
                } else {
                    if (0 < open) {
                        diff += "</span>";
                        open = false;
                    }
                    openPos++;
                }
                diff += right[i];
            }
        }

        return diff;
    };

    var diff = function (urlLeft, responseLeft, urlRight, responseRight, callback) {
        var diff = [],
            left = responseLeft.split("\n"),
            right = responseRight.split("\n"),
            lineLeft,
            lineRight,
            i,
            j,
            lines;

        lines = (left.length > right.length ? left.length : right.length);

        for (i = 0; i <= lines; i++) {
            lineLeft = (left.hasOwnProperty(i) ? left[i] : "");
            lineRight = (right.hasOwnProperty(i) ? right[i] : "");


            if (lineLeft != lineRight) {

                diff.push({
                    line : i + 1,
                    left : clear(lineLeft),
                    right: highlight(clear(lineLeft), clear(lineRight))
                });
            }
        }

        callback({
            diff : diff,
            left : responseLeft,
            right : responseRight
        });
    };

    var start = function (urlLeft, urlRight, callback) {
        request({ url : urlLeft }, function (errorLeft, responseLeft) {
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
}
