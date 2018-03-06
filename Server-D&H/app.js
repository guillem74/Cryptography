	const express = require('express');
	const path = require('path');
	const logger = require('morgan');
	const cookieParser = require('cookie-parser');
	const bodyParser = require('body-parser');
	const bigInt = require ('big-integer');
	const crypto = require ('crypto');

	var app = express();

	var p = bigInt(4);
	const g = bigInt(2);
	const bits = bigInt(16);

	while (!p.isPrime()){

		p = bigInt.randBetween(bigInt(2).pow(bits.minus(1)), bigInt(2).pow(bits).minus(1))
	}

	var a = bigInt(bigInt.randBetween(2, p.minus(1)));

	var A = bigInt(g.modPow(a,p));


	app.set('views', path.join(__dirname, 'views'));
	app.set('view engine', 'jade');

	//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
	app.use(logger('dev'));
	app.use(bodyParser.json());
	app.use(bodyParser.urlencoded({ extended: false }));
	app.use(cookieParser());
	app.use(express.static(path.join(__dirname, 'public')));


	app.get('/key', function (req,res){
		var response= {};

		response.p=p;
		response.g=g;
		response.A=A;

		res.status(200).send(response)

	});

	app.post('/message', function(req, res){
		var B = bigInt(req.body.B);
		var mEncrypted = req.body.message;
		var mDecrypted;

		//Generate the key
		var key = bigInt(B.modPow(a,p));

		//Decrypt message
		var decipher = crypto.createDecipher('aes192', key.toString(16));
		mDecrypted = decipher.update(mEncrypted, 'hex', 'utf8');
		mDecrypted += decipher.final('utf8');

		console.log("Decrypted message: ", mDecrypted)

		res.status(200).send("ok")


	});

	app.listen(3000);
	console.log("Server listening on port 3000");

