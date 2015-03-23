/*global require, module, __dirname, process */
/*jslint unparam: true, sloppy: true, vars: true */

var express = require("express"),
    app = express(),
    server,
    DiffTool = require("./DiffTool"),
    swig = require("swig"),
    diffTool = new DiffTool();

// express server
server = app.listen(process.env.PORT || process.argv[2] || 3000, function () {
    console.log("[app] start - port:%s", server.address().port);
})

// assets
app.use("/images", express.static(__dirname + "/assets/images"));
app.use("/css", express.static(__dirname + "/assets/css"));
app.use("/js", express.static(__dirname + "/assets/js"));

// start page
app.get("/", function (req, res) {
    var template = swig.compileFile(__dirname + '/assets/templates/index.html');
    res.send(template());
});

// diff site
app.get("/diff/:left/:right", function (req, res) {
    var leftUrl = req.params.left,
        rightUrl = req.params.right;

    if ("http" != leftUrl.substr(0, 4)) {
        leftUrl = "http://" + leftUrl;
    }

    if ("http" != rightUrl.substr(0, 4)) {
        rightUrl = "http://" + rightUrl;
    }

    diffTool.start(leftUrl, rightUrl, function (error, result) {
        var template = swig.compileFile(__dirname + '/assets/templates/diff.html');
        res.send(template({ result : result }));
    });
});