const bignum = require('bignum');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const bits = bignum(16);

p = bignum(2).pow(bits.sub(1)).rand(bignum(2).pow(bits)).nextPrime();
q = bignum(2).pow(bits.sub(1)).rand(bignum(2).pow(bits)).nextPrime();

n = p.mul(q);
phi = (p.sub(1)).mul((q.sub(1)));
e = bignum(65537);
d = e.invertm(phi);

app.get('/public', function(req,res){

    var response = {};
    response.e = e.toString();
    response.n = n.toString();
    res.status(200).send(response);
});

app.post('/message', function(req, res){
    let c = bignum(req.body.c);
    res.status(200).send("Correct");
    let m = c.powm(d, n);
    console.log(m);
});



app.listen(3000);
console.log("Listening on port 3000");
