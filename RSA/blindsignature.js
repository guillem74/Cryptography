'use strict';

const request = require('request');
const bignum = require('bignum');

const msg = "Blind signature";
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
            const res = JSON.parse(body);
            const e = bignum(res.e);
            const n = bignum(res.n);

            let r = n.rand();
            while (r.gcd(n)!=1){
                r= n.rand();
            }
            const m2 = r.powm(e,n);
            const mPrime = m.mul(m2);

            let message = {};
            message.m = mPrime.toString();
            request({
                url: 'http://localhost:3000/blindSignature',
                method: 'POST',
                body: message,
                json: true
            }, function(error, response, body){
                if (error)
                    console.log("POST error");
                else {
                    console.log(body)
                    const res = JSON.parse(body)

                }
            });
        }

    });