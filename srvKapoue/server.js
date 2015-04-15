var express = require('express');
var http = require('http');
var busboy = require('connect-busboy');
var fs = require('fs');
var walk = require('walk');
var mysql = require('mysql');
var bodyParser = require('body-parser');

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
});
console.log("Binded App /kapoue/:id");

// Images de Kapoue parcours le repertoire img
app.get('/repertoireimg', function (req, res) {
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
            image.titre = "";
            image.description = "";
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
console.log("Binded App /contenuimg");

// Images de Kapoue parcours le repertoire img
app.get('/photos', function (req, res) {
    var titre;
    var description;
    var requete = 'SELECT * FROM photo ';
    connection.query(requete, function (err, rows, fields) {
        console.log(rows);
        var jObject = [];
        if (!err) {
            var i;
            for (i in rows) {
                var image = {};
                image.url = rows[i].chemin;
                image.index = rows[i].id;
                image.titre = rows[i].titre;
                image.description = rows[i].commentaires;
                jObject.push(image);
            }
        }
        else {
            console.log('Error while performing Query.' + err);
        }
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

// Images de Kapoue, va chercher dans la bd la bonne photo
app.get('/photo/:id', function (req, res) {

    var chemin;
    var titre;
    var description;
    var requete = 'SELECT * FROM photo WHERE id=' + req.params.id;
    connection.query(requete, function (err, rows, fields) {
        console.log(rows);
        var jObject = [];
        var image = {};
        if (!err) {
            image.url = rows[0].chemin;
            image.index = req.params.id;
            image.titre = rows[0].titre;
            image.description = rows[0].commentaires;
            jObject.push(image);
        }
        else {
            console.log('Error while performing Query.' + err);
        }
        res.contentType('application/json');
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization');
        res.header('Access-Control-Allow-Methods', 'GET,PUT,PATCH,POST,DELETE');
        res.json(jObject);
    });
});
console.log("Binded App /photo/id");


// upload de fichier par post
app.post('/upload', function (req, res) {
    console.log("appel post");

    var nomfichier;
    var titre;
    var description;
    var fstream;

    req.pipe(req.busboy);

    // analyse de la partie fichier
    req.busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
        console.log('fichier [' + fieldname + ']: filename: ' + filename + ', encoding: ' + encoding);
        if (filename) {
            console.log("Upload du fichier: " + filename);
            nomfichier = filename;
            fstream = fs.createWriteStream(absoluteImgDir + '/' + filename);
            file.pipe(fstream);
        }
        else {
            console.log("pas de fichier a uploader");
            file.resume();
        }
        file.on('end', function (chunk) {
            console.log('fin de l upload');
        });
    });

    // analyse de la partie champs
    req.busboy.on('field', function (fieldname, val, fieldnameTruncated, valTruncated) {
        if (fieldname == "titre") {
            console.log("le titre du fichier est " + val);
            titre = val;
        }
        if (fieldname == "description") {
            console.log("la description du fichier est " + val);
            description = val;
        }
    });

    // fin de l'analyse, insertion sql
    req.busboy.on('finish', function () {
        console.log('Done parsing form!');
        if (nomfichier) {
            console.log('upload du fichier');
            console.log('Done parsing form! Insertion sql');
            var valeurs = '("./images/' + nomfichier + '","' + titre + '","' + description + '")';
            var requete = 'insert into photo (chemin,titre,commentaires) values ' + valeurs;
            console.log(requete);
            connection.query(requete);
        }
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