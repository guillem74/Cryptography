'use strict';

const bignum = require('bignum');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const rsa = require('./rsa');
const app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


const { publicKey, privateKey } = rsa.generateRandomKeys(512);



//Send public keys
app.get('/publicKeys', function(req,res){
    res.status(200).send(publicKey);
});

//Receive crypted message and decrypt using private keys
app.post('/decrypt', function(req, res){
    let c = bignum(req.body.c, 16);
    console.log(c);
    res.status(200).send("Correct");
    const msg = privateKey.decrypt(c);
    const msg2 = msg.toBuffer().toString();
    console.log(msg2);
});

//Receive m' and compute sigma'
app.post('/blindSignature', function(req,res){

    const mPrime = bignum(req.body.m);
    //sigma' = m'^d mod(n)
    const sigmaPrime = privateKey.sign(mPrime);
    let response = {};
    response.s = sigmaPrime.toString();
    res.status(200).send(response);
});

app.listen(3000);
console.log("Listening on port 3000");
