'use strict';

const request = require('request');
const bignum = require('bignum');
const paillier = require('./paillier');


let num1 = 2;
let num2 = 4;
let num3 = 6;

request({
        uri: 'http://localhost:3000/key',
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    },

    function(error, response, body) {

        if (error)
            console.log("GET error");
        else{
            const r = JSON.parse(body);
            //Receive public keys
            const publicKey = new paillier.PublicKey(r.n, r.g);
            let bn1 = bignum(num1).mod(publicKey.n);

            //If bn1 is negative, turn it positive
            while (bn1.lt(0))
                bn1 = bn1.add(publicKey.n);

            let bn2 = bignum(num2).mod(publicKey.n);

            //If bn1 is negative, turn it positive
            while (bn2.lt(0))
                bn2 = bn2.add(publicKey.n);

            let bn3 = bignum(num3).mod(publicKey.n);

            while (bn3.lt(0))
                bn3 = bn3.add(publicKey.n);

            let c1 = publicKey.encrypt(bn1);
            let c2 = publicKey.encrypt(bn2);
            let c3 = publicKey.encrypt(bn3);


            let encryptedSum = publicKey.addition(c1, c2, c3);
            console.log(encryptedSum);
            let message = {};
            message.sum = encryptedSum.toString(16);

            request({
                url: 'http://localhost:3000/decrypt',
                method: 'POST',
                body: message,
                json: true
            }, function(error, response, body){
                if (error)
                    console.log("POST error");
                else
                    console.log(body);
            });

        }

    });






