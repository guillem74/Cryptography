'use strict';

const request = require('request');
const bignum = require('bignum');
const rsa = require('./rsa');



const msg = "Esto esta encriptado";
const buff = Buffer.from(msg);
const m = bignum.fromBuffer(buff);

let pubKey;

request({
        uri: 'http://localhost:3000/publicKeys',
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    },

    function(error, response, body) {

        if (error)
            console.log("GET error");
        else{
            let r = JSON.parse(body);
            //Receive public keys

            pubKey = rsa.publicKey(r);
            //public key obtained
            let c = pubKey.encrypt(m);
            let message = {};
            message.c = c;
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






