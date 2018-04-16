'use strict';

const request = require('request');
const bignum = require('bignum');
const readline = require('readline');


const msg = "Estamos encriptando y desencriptando";
const buff = Buffer.from(msg);
const m = bignum.fromBuffer(buff);

let option = 2;


if (option == 1){

    request({
            uri: 'http://localhost:3000/encrypt',
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

}

else{

    request({
            uri: 'http://localhost:3000/sign',
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
                let s = bignum(r.s);
                let m = s.powm(e, n);
                let message = {};
                let m2 = m.toBuffer().toString();
                console.log(m2);
                message.m = m2;
                request({
                    url: 'http://localhost:3000/verify',
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


}


