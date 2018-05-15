'use strict';

const request = require('request');
const bignum = require('bignum');
const rsa = require('../RSA/rsa');
const nr = require('./nonrepudiation');
const crypto = require ('crypto');

const { publicKey, privateKey } = rsa.generateRandomKeys(512);


const a = "A";
const b = "B";
const m = "This is the secret message";
const ttp = "TTP";

const k = "Symmetric key";
const cipher = crypto.createCipher('aes256', k.toString(16));
let c = cipher.update(m, 'utf8', 'hex');
c += cipher.final('hex');


const array = new Array(a, b, c);
const concat = array.join(',');
const signed = nr.proof(concat, privateKey);
let message = {};
message.a = a;
message.b = b;
message.c = c;
message.po = signed;
message.pubkey = publicKey;

request({
    url: 'http://localhost:3000/proofOfReception',
    method: 'POST',
    body: message,
    json: true
}, function(error, response, body){
    if (error)
        console.log("POST error");
    else{
        const pr = bignum(body.pr, 16);
        const a = body.a;
        const b = body.b;
        const pubKeyB = rsa.publicKey(body.pubKey);
        const hash = pubKeyB.verify(pr);
        console.log(hash);

        const array = new Array(b, a, c);
        const concat = array.join(',');
        const hashCheck = nr.check(concat);
        console.log(hashCheck);

        const pko = new Array(a, ttp, b, k);
        const concatPko = pko.join(',');
        const signed = nr.proof(concatPko, privateKey);
        let message = {};
        message.a = a;
        message.ttp = ttp;
        message.b = b;
        message.k = k;
        message.pko = signed;
        message.pubkey = publicKey;

        request({
            url: 'http://localhost:3100/proofOfPubK',
            method: 'POST',
            body: message,
            json: true
        }, function(error, response, body){
            if (error)
                console.log("POST error");
            else{

            }
        });

    }
});

