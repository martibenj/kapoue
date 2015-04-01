var express = require('express');
var http = require('http');
var app = express();

console.log("#########################################");
console.log("Starting Mega Kapoue Mustache Uber Server");
console.log("#########################################");

app.get('/kapoue', function(req, res) {
    res.contentType('application/json');
    res.status(500);
    res.json(
        [
        {"name": "wine1"},
        {"name": "wine2"}
    ]);
});
console.log("Binded App /kapoue");

app.get('/kapoue/:id', function(req, res) {
    console.log("Calling " + req.params.id);
    res.contentType('application/json');
    res.json(
        {
	  "objet": {
            "id": req.params.id,
            "name": "Test nodejs",
            "description": "Description du test nodeJS + angularJS + REST"
          }
        });
});
console.log("Binded App /kapoue/:id");


var srvAddress = "0.0.0.0";
var srvPort = 3000;

var server = http.createServer(app).listen(srvPort, srvAddress);

console.log("Server listening on address : %s", srvAddress)
console.log("Server listening on port : %s", srvPort)


