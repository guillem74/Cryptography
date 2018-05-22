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

    const array = [req.body.a, req.body.ttp, req.body.b, req.body.k];
    const check = nr.check(bignum(req.body.pko, 16), req.body.pubkey, array);
    if (check == false){
        res.status(400).send("Error")
    }
    else{

        const array2 = [req.body.ttp, req.body.a, req.body.b, req.body.k];
        const pkp = nr.proof(array2, privateKey);
        let message = {
            ttp : req.body.ttp,
            a : req.body.a,
            b : req.body.b,
            k : req.body.k,
            pkp : pkp,
            pubKey : publicKey
        };

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
    }



});


app.listen(3100);
console.log("Listening on port 3100");