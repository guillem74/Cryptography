'use strict';

const request = require('request');
const bignum = require('bignum');
const rsa = require('../RSA/rsa');
const nr = require('./nonrepudiation');
const crypto = require('crypto');

const {publicKey, privateKey} = rsa.generateRandomKeys(512);


const a = "A";
const b = "B";
const m = "This is the secret message";
const ttp = "TTP";
const k = "Symmetric key";
const cipher = crypto.createCipher('aes256', k.toString(16));
let c = cipher.update(m, 'utf8', 'hex');
c += cipher.final('hex');


const array = [a, b, c];
const signed = nr.proof(array, privateKey);
let message = {
    a : a,
    b : b,
    c : c,
    po : signed,
    pubkey : publicKey
};

request({
    url: 'http://localhost:3000/proofOfReception',
    method: 'POST',
    body: message,
    json: true
}, function (error, response, body) {
    if (error)
        console.log("POST error");
    else {
        const array = [body.a, body.b, body.c];
        nr.check(bignum(body.pr, 16), body.pubKey, array);

        const pko = [a, ttp, b, k];
        const signed = nr.proof(pko, privateKey);
        let message = {
            a : body.a,
            ttp : ttp,
            b : body.b,
            k : k,
            pko : signed,
            pubkey : publicKey
        };
        request({
            url: 'http://localhost:3100/proofOfPubK',
            method: 'POST',
            body: message,
            json: true
        }, function (error, response, body) {
            if (error)
                console.log("POST error");
            else {

            }
        });

    }
});

