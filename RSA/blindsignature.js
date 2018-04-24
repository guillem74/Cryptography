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

            //Obtain public parameters
            const res = JSON.parse(body);
            const e = bignum(res.e);
            const n = bignum(res.n);

            let r = n.rand();
            while (r.gcd(n)!=1){
                r= n.rand();
            }
            //Compute m2 = r^e mod(n)
            const m2 = r.powm(e,n);
            //Compute m' = m * m2
            const mPrime = m.mul(m2).mod(n);
            //Invert r for later
            const rInv = r.invertm(n);

            //Send m'
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
                    const res = bignum(body.s);
                    //Compute sigma = sigma' * r^-1 * mod(n)
                    const sigma = (res.mul(rInv)).mod(n);
                    // Compute sigma^e mod (n)
                    const deNum = sigma.powm(e, n);
                    const de = deNum.toBuffer().toString();
                    console.log(de);

                }
            });
        }

    });