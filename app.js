var express = require('express');
var app = express();

var Robo1 = require('./controller/Robo1');
app.use('/robo1', Robo1);
module.exports = app;