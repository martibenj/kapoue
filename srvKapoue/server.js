var express = require('express');
var http = require('http');

var app = express();

console.log("#########################################");
console.log("Starting Mega Kapoue Mustache Uber Server");
console.log("#########################################");

// Activating CORS for all
app.use(function(req, res, next) {
    express.static(__dirname);
    if (req.headers.origin) {
        res.header('Access-Control-Allow-Origin', '*')
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization')
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE')
    }
    next()
});

// utilisation du repertoire cliKapoue en static
app.use(express.static(__dirname + '/cliKapoue'));
app.get('/', function(req, res, next){
    res.render('./index.html');
});

// Kapoue 1 with fake objects "name"
app.get('/kapoue', function(req, res) {
    res.contentType('application/json');
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    res.json(
        [
        {"name": "wine1"},
        {"name": "wine2"}
    ]);
});
console.log("Binded App /kapoue");

// Kapoue 2 with more attr
app.get('/kapoue/:id', function(req, res) {
    console.log("Calling with id=" + req.params.id);
    res.contentType('application/json');
    res.json(
    {
      "petiteKapoue": {
	"id": req.params.id,
	"name": "Elle a vu la boite de mélange à purée",
	"description": "Et direct ! Elle a fait \"Kapouuuuééééé\" !!"
      }
    });
});
console.log("Binded App /kapoue/:id");

// Image de Kapoue
app.get('/photo/:id', function(req, res)
{
    console.log("envoi d'une image" + req.params.id);
    res.sendFile(__dirname + '/img/kapoue.jpg');
});
console.log("Binded App /photo/:id");

// Setting value for server
var srvAddress = "0.0.0.0";
var srvPort = 3000;

// Creating Server
var server = http.createServer(app).listen(srvPort, srvAddress);

// Displaying server info in node console
console.log("Server listening on address : %s", srvAddress)
console.log("Server listening on port : %s", srvPort)



