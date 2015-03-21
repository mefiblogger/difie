/*global require, module */
/*jslint unparam: true, sloppy: true, vars: true */

var express = require("express"),
    app = express(),
    server,
    DiffTool = require("./DiffTool"),
    swig = require("swig"),
    diffTool = new DiffTool();

// disable swig escaping
swig.setDefaults({ autoescape: false });

// express server
server = app.listen(process.env.PORT || process.argv[2] || 3000, function () {
    console.log("[app] start - port:%s", server.address().port);
})

// assets
app.use("/images", express.static(__dirname + "/assets/images"));
app.use("/css", express.static(__dirname + "/assets/css"));
app.use("/js", express.static(__dirname + "/assets/js"));

// diff site
app.get("/", function (req, res) {
    diffTool.start("http://ingatlan.com/21242380", "http://ingatlan.com/21242382", function (error, result) {
        var template = swig.compileFile(__dirname + '/assets/templates/diff.html');
        res.send(template({ result : result }));
    });
});