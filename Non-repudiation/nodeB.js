'use strict';

const bignum = require('bignum');
const crypto = require('crypto');

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');


const nr = require('./nonrepudiation');
const rsa = require('../RSA/rsa');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


//B keys
const {publicKey, privateKey} = rsa.generateRandomKeys(512);

let c;

//Proof of reception
app.post('/proofOfReception', function(req, res){
    const a = req.body.a;
    const b = req.body.b;
    c = req.body.c;
    const po = bignum(req.body.po, 16);
    const pubKeyA = rsa.publicKey(req.body.pubkey);
    const hash = pubKeyA.verify(po);
    console.log(hash);

    const array = new Array(a, b, c);
    const concat = array.join(',');
    const hashCheck = nr.check(concat);
    console.log(hashCheck);

    const array2 = new Array(b, a, c);
    const concat2 = array2.join(',');
    const signed = nr.proof(concat2, privateKey);

    let message = {};
    message.b = b;
    message.a = a;
    message.pr = signed;
    message.pubKey = publicKey;

    res.status(200).send(message);

});

app.post('/checkK', function(req, res){
    const k = req.body.k;

    const decipher = crypto.createDecipher('aes256', k.toString(16));
    let mDecrypted = decipher.update(c, 'hex', 'utf8');
    mDecrypted += decipher.final('utf8');
    console.log(mDecrypted);

    res.status(200).send("Everything ok!");

});


app.listen(3000);
console.log("Listening on port 3000");