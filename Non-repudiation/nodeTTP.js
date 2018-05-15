'use strict';

const bignum = require('bignum');

const request = require('request');
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


//TTP keys
const {publicKey, privateKey} = rsa.generateRandomKeys(512);



//Proof of reception
app.post('/proofOfPubK', function(req, res){
    const a = req.body.a;
    const ttp = req.body.ttp;
    const b = req.body.b;
    const k = req.body.k;
    const pko = bignum(req.body.pko, 16);
    console.log(k);

    const pubKeyA = rsa.publicKey(req.body.pubkey);
    const hash = pubKeyA.verify(pko);
    console.log(hash);

    const array = new Array(a, ttp, b, k);
    const concat = array.join(',');
    const hashCheck = nr.check(concat);
    console.log(hashCheck);

    const array2 = new Array(ttp, a, b, k);
    const concat2 = array2.join(',');
    const pkp = nr.proof(concat2, privateKey);
    let message = {};
    message.ttp = ttp;
    message.a = a;
    message.b = b;
    message.k = k;
    message.pkp = pkp;
    message.pubKey = publicKey;

    res.status(200).send(message);

    request({
        url: 'http://localhost:3000/checkK',
        method: 'POST',
        body: message,
        json: true
    }, function(error, response, body){
        if (error)
            console.log("POST error");
        else{

        }
    });


});


app.listen(3100);
console.log("Listening on port 3100");