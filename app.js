var bodyparser = require('body-parser');
var express = require('express');


var app = express();
var port = 3000;
app.listen(port, function() {
    console.log('--------------------SERVER INITIALIZED--------------------');
});