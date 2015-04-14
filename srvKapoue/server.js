var express = require('express');
var http = require('http');
var busboy = require('connect-busboy');
var fs = require('fs');
var walk = require('walk');
var mysql = require('mysql');
var bodyParser = require('body-parser');

var util = require('util');

var inspect = util.inspect;
var app = express();

// utilisation du parser bodyparser pour des types simples
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
// utilisation du parser busboy pour des types complexes
app.use(busboy({immediate: true}));

console.log("#########################################");
console.log("Starting Mega Kapoue Mustache Uber Server");
console.log("#########################################");

// Creation de la connexion a mysql
var connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '2948',
    database: 'test'
});
connection.connect(function (err) {
    if (!err) {
        console.log("Database is connected ... \n");
    } else {
        console.log("Error connecting database ... \n");
    }
});


// Activating CORS for all
app.use(function (req, res, next) {
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
app.get('/kapoue/:id', function (req, res) {
    console.log("Calling with id=" + req.params.id);

    var citation;
    connection.query('SELECT * from citations WHERE id=' + req.params.id, function (err, rows, fields) {

        if (!err) {
            citation = rows[0].citation
        }
        else {
            console.log('Error while performing Query.' + err);
            citation = "";
        }

        res.contentType('application/json');
        res.json(
            {
                "petiteKapoue": {
                    "id": req.params.id,
                    "name": "Elle a vu la boite de mélange à purée",
                    "description": "Et direct ! Elle a fait \"Kapouuuuééééé\" !!",
                    "donnees": citation
                }
            }
        );
    });
    connection.end();
});
console.log("Binded App /kapoue/:id");

// Images de Kapoue
app.get('/photos', function (req, res) {
    // Recherche des fichiers dans le repertoire img
    var files = [];
    var walker = walk.walk('./' + imgDir, {followLinks: false});
    walker.on('file', function (root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function () {
        // fin du parcours, on créé un objet json et on retourne la reponse
        var jObject = [];
        var i;
        for (i in files) {
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
app.get('/photo/:id', function (req, res) {
    // recherche des fichiers dans le repertoire img
    var files = [];
    var walker = walk.walk('./img', {followLinks: false});
    walker.on('file', function (root, stat, next) {
        // Add this file to the list of files
        files.push(stat.name);
        next();
    });

    walker.on('end', function () {
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
app.post('/upload', function (req, res) {
    console.log("appel post");
    var nomfichier;
    var titre;
    var description;

    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('File [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding);
        if (filename) {
            console.log("Upload du fichier: " + filename);
            nomfichier = './images/' + filename;

            fstream = fs.createWriteStream(absoluteImgDir + '/' + filename);
            file.pipe(fstream);
            fstream.on('close', function () {
            });
        }
    });
    req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        console.log('Field [' + fieldname + ']: value: ' + inspect(val));
        if (fieldname == "titre") {
            console.log("le titre du fichier est " + inspect(val));
            titre = val;
        }
        if (fieldname == "description") {
            console.log("la description du fichier est " + inspect(val));
            description = val;
        }
    });

    req.busboy.on('finish', function () {
        console.log('Done parsing form! Insertion sql');
        var valeurs  = '("' + nomfichier + '","' + titre + '","' + description + '")';
        var requete = 'insert into photo (chemin,titre,commentaires) values ' + valeurs;
        console.log(requete);
        connection.query(requete);

        res.writeHead(303, {Connection: 'close', Location: '/'});
        res.end();
    });
});

// upload de fichier par post
app.post('/', function (req, res) {
    console.log("appel post racine /");
    var mail = req.body.email;
    console.log("mail : " + mail);
    res.writeHead(303, {Connection: 'close', Location: '/'});
    res.end();
});

// Setting value for server
var srvAddress = "0.0.0.0";
var srvPort = 3000;

// Creating Server
var server = http.createServer(app).listen(srvPort, srvAddress);

// Displaying server info in node console
console.log("Server listening on address : %s", srvAddress);
console.log("Server listening on port : %s", srvPort);