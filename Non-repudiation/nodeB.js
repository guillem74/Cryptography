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

    c = req.body.c;
    const array = [req.body.a, req.body.b, c];
    const check = nr.check(bignum(req.body.po, 16), req.body.pubkey, array);
    if (check == false){
        res.status(400).send("Error")
    }
    else{
        const array2 = [req.body.b, req.body.a, c];
        const signed = nr.proof(array2, privateKey);

        let message = {
            b : req.body.b,
            a : req.body.a,
            pr : signed,
            pubKey : publicKey
        };

        res.status(200).send(message);
    }

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