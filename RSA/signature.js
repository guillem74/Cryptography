
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

            let message = {};
            message.m = buff;

            request({
                url: 'http://localhost:3000/sign',
                method: 'POST',
                body: message,
                json: true
            }, function(error, response, body){
                if (error)
                    console.log("POST error");
                else {
                    const s = bignum(body.m);
                    console.log(s);
                    const m = s.powm(e, n);
                    const msg2 = m.toBuffer().toString();
                    console.log(msg2);
                    console.log(msg);

                }
            });
        }

    });