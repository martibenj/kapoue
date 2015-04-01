var express = require('express');

 
var app = express();


console.log("demarrage");

app.get('/kapoue', function(req, res) {
    res.contentType('application/json');
    res.status(500);
    res.json(
        [
        {"name": "wine1"},
        {"name": "wine2"}
    ]);
});

app.get('/kapoue/:id', function(req, res) {
    console.log("appel a " + req.params.id);
    res.contentType('application/json');
    res.json(
        {"objet": {
            "id": req.params.id,
            "name": "test nodejs",
            "description": "description du test nodeJS + angularJS + REST"
        }
        });
});
 
app.listen(3000);