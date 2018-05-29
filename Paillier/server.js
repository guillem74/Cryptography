'use strict';
const paillier = require('./paillier');
const bignum = require('bignum');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const { publicKey, privateKey } = paillier.generateRandomKeys(512); // Change to at least 2048 bits in production state

app.get('/key', function(req,res){
    let key = {};
    key.n = publicKey.n.toString(16);
    key.g = publicKey.g.toString(16);

    res.status(200).send(key);
});

app.post('/decrypt', function(req, res){
    const encryptedSum = bignum(req.body.sum, 16);
    let decryptedSum = privateKey.decrypt(encryptedSum);
    console.log('Sum:', decryptedSum.toString());
    res.status(200).send("Correct");
});

app.listen(3000);
console.log("Listening on port 3000");
