'use strict';

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

const p = bignum.prime(1024, true);
const q = bignum.prime(1024, true);

const n = p.mul(q);
const phi = (p.sub(1)).mul(q.sub(1));
const e = bignum(65537);
const d = e.invertm(phi);


app.get('/publicKeys', function(req,res){
    let response = {};
    response.e = e.toString();
    response.n = n.toString();
    res.status(200).send(response);
});

app.post('/decrypt', function(req, res){
    let c = bignum(req.body.c);
    res.status(200).send("Correct");
    let m = c.powm(d, n);
    const msg = m.toBuffer().toString();
    console.log(msg);
});

app.post('/sign', function(req,res){

    const message = bignum(req.body.m);
    const s = message.powm(d, n);
    let response = {};
    response.m = s.toString();
    res.status(200).send(response);

});


app.post('/blindSignature', function(req,res){
    const mPrime = bignum(req.body.m);
    const sigma = mPrime.powm(d, n);
    let response = {};
    response.s = sigma.toString();
    res.status(200).send(response);
});

app.listen(3000);
console.log("Listening on port 3000");
