var express = require('express');
var http = require('http');
var busboy = require('connect-busboy');
var fs = require('fs');
var walk = require('walk');

var app = express();

console.log("#########################################");
console.log("Starting Mega Kapoue Mustache Uber Server");
console.log("#########################################");


// ???
app.use(busboy());

// Activating CORS for all
app.use(function(req, res, next) {
    if (req.headers.origin) {
        console.log("Adding Access-Control-Allow-Origin");
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
    }
    next()
});

// Utilisation du repertoire cliKapoue en static
app.use("/", express.static(__dirname + '/cliKapoue'));

// Storing img dir
var imgDir = "/img";
var absoluteImgDir = __dirname + imgDir;
// Binding des objets dans img avec l'url /images/
app.use("/images", express.static(absoluteImgDir));

// App /kapoue
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
    }
    );
});
console.log("Binded App /kapoue/:id");

// Images de Kapoue
app.get('/photos', function(req, res)
{
    // Recherche des fichiers dans le repertoire img
    var files   = [];
    var walker  = walk.walk('./'+imgDir, { followLinks: false });
    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function() {
        // fin du parcours, on créé un objet json et on retourne la reponse
        var jObject = [];
        var i;
        for(i in files)
        {
            var image = {};
            image.url = "./images/" + files[i];
            image.index = i;
            jObject.push(image);

        }
        console.log('jObject');
        console.log(jObject);
        // construction de la reponse
        res.contentType('application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
        res.json(jObject);
    });
});
console.log("Binded App /photos");


// Images de Kapoue
app.get('/photo/:id', function(req, res)
{
    // recherche des fichiers dans le repertoire img
    var files   = [];
    var walker  = walk.walk('./img', { followLinks: false });
    walker.on('file', function(root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function() {
        // fin du parcours, on créea un objet json et on retourne la reponse
        var jObject = [];
        var image = {};
        image.url = "./images/" + files[req.params.id];
        image.index = req.params.id;
        jObject.push(image);
        // construction de la reponse
        res.contentType('application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
        res.json(jObject);
    });
});
console.log("Binded App /photos");


// upload de fichier par post
app.post('/upload', function(req, res) {
    console.log("appel post");
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename) {
        if (filename) {
            console.log("Upload du fichier: " + filename);
            fstream = fs.createWriteStream(absoluteImgDir + '/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
                res.redirect('http://www.youtube.com/watch?v=oavMtUWDBTM');
            });
        }
    });
});



// Setting value for server
var srvAddress = "0.0.0.0";
var srvPort = 3000;

// Creating Server
var server = http.createServer(app).listen(srvPort, srvAddress);

// Displaying server info in node console
console.log("Server listening on address : %s", srvAddress)
console.log("Server listening on port : %s", srvPort)