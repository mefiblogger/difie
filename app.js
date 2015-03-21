var express = require("express"),
    app = express(),
    server,
    DiffTool = require("./DiffTool"),
    swig = require("swig"),
    diffTool = new DiffTool();

swig.setDefaults({ autoescape: false });

server = app.listen(process.env.PORT || process.argv[2] || 3000, function () {
    console.log("[app] start - port:%s", server.address().port);
})

app.get("/", function (req, res) {
    diffTool.start("http://mefi.be/", "http://mefi.be/", function (data) {
        var template = swig.compileFile(__dirname + '/assets/templates/diff.html');
        res.send(template({ data : data}));
    });
});