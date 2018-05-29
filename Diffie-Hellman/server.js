"use strict";

const express = require('express');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const bigInt = require ('big-integer');
const crypto = require ('crypto');

const dh = require('./dh');

const app = express();


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

const p = dh.DH.getDHParams();
const param = new dh.DH(p, 2);


app.get('/key', function (req,res){

	res.status(200).send(param)

});

app.post('/message', function(req, res){


	const B = bigInt(req.body.B, 16);
	const mEncrypted = req.body.message;
	let mDecrypted;

	const iv = Buffer.from(req.body.iv);
	//Generate the key
	const dhKey = param.sharedKey(B);
	const key = Buffer.from(dhKey.toString(16), 'hex').slice(0, 32);

	//Decrypt message
	let decipher = crypto.createDecipheriv('aes256', key, iv);
	mDecrypted = decipher.update(mEncrypted, 'hex', 'utf8');
	mDecrypted += decipher.final('utf8');

	console.log("Decrypted message: ", mDecrypted);

	res.status(200).send("Correct");


});

app.listen(3000);
console.log("Server listening on port 3000");

