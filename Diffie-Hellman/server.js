"use strict";

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bigInt = require ('big-integer');
const crypto = require ('crypto');

const app = express();

let p = bigInt(4);
const g = bigInt(2);
const bits = bigInt(16);

while (!p.isPrime()){

	p = bigInt.randBetween(bigInt(2).pow(bits.minus(1)), bigInt(2).pow(bits).minus(1))
}

const a = bigInt(bigInt.randBetween(2, p.minus(1)));

const A = bigInt(g.modPow(a,p));


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.get('/key', function (req,res){

	let response= {};

	response.p=p;
	response.g=g;
	response.A=A;

	res.status(200).send(response)

});

app.post('/message', function(req, res){

	const B = bigInt(req.body.B);
	const mEncrypted = req.body.message;
	let mDecrypted;

	//Generate the key
	const key = bigInt(B.modPow(a,p));
	const iv = req.body.iv;

	//Decrypt message
	const decipher = crypto.createDecipher('aes256', key.toString(16), iv);
	mDecrypted = decipher.update(mEncrypted, 'hex', 'utf8');
	mDecrypted += decipher.final('utf8');

	console.log("Decrypted message: ", mDecrypted);

	res.status(200).send("Correct");


});

app.listen(3000);
console.log("Server listening on port 3000");

