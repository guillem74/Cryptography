'use strict';

const bignum = require('bignum');
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



//Proof of reception
app.post('/proofOfReception', function(req, res){
    const a = req.body.a;
    const b = req.body.b;
    const c = req.body.c;
    const po = bignum(req.body.po, 16);
    const pubKeyA = req.body.pubkey;
    console.log(c);
    console.log(po);
    res.status(200).send("Correct");

    //const msg = privateKey.decrypt(c);
    //const msg2 = msg.toBuffer().toString();
    //console.log(msg2);
});


app.listen(3000);
console.log("Listening on port 3000");