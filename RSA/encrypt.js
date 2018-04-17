'use strict';

const request = require('request');
const bignum = require('bignum');


const msg = "Esto esta encriptado";
const buff = Buffer.from(msg);
const m = bignum.fromBuffer(buff);

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
            let e = bignum(r.e);
            let n = bignum(r.n);
            let message = {};
            let c = m.powm(e, n);
            message.c = c.toString();
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








