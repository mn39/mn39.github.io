// server.js

const express = require('express');
const app = express();

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended : true}));

app.listen(8080, function () {
    console.log('listening on 8080')
})

app.get('/index', function(req, res){
    res.sendFile(__dirname + '/index.html')
})

app.post('/test', function(req, res){
    console.log(req.body.title, req.body.date)
});