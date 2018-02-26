

        const express = require('express');
        const bigInt = require('big-integer');
        const crypto = require('crypto');


        var app = express();

        var p = bigInt(4);
        var g = bigInt(2);
        const bits = bigInt(16);

        while (!bigInt(p).isPrime()){

            p = bigInt.randBetween(bigInt(2).pow(bits.minus(1)), bigInt(2).pow(bits).minus(1))

        }


        var a = bigInt(bigInt.randBetween(2, p.minus(1)));
        var ga = bigInt(g).modPow(a, p);


        app.get('/getkey', function(req,res){

            var response = {};
            response.p=p;
            response.g=g;
            response.A=ga;

            res.status(200).send(response);
        });

        app.post('/message', function(req, res){

            var B = bigInt(req.body.B);
            var Encrypted = req.body.message;
            var Decrypted;


            var key = bigInt(B.modPow(a,p));


            var decipher = crypto.createDecipher('aes192', key.toString(16));
            Decrypted = decipher.update(Encrypted, 'hex', 'utf8');
            Decrypted += decipher.final('utf8');

            console.log("Decrypted message: ", Decrypted);

            res.status(200).send("Correct")


        });


        //Listen on port 3000
        app.listen(3000);
        console.log("Server listening on port 3000");

