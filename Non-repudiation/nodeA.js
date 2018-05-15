'use strict';

const request = require('request');
const bignum = require('bignum');
const rsa = require('../RSA/rsa');
const nr = require('./nonrepudiation');
const crypto = require ('crypto');

const { publicKey, privateKey } = rsa.generateRandomKeys(512);


const a = "A";
const b = "B";
const m = "Mensaje de A a B";
const ttp = "TTP";

const k = "Clave simetrica";
const cipher = crypto.createCipher('aes256', k.toString(16));
let c = cipher.update(m, 'utf8', 'hex');
c += cipher.final('hex');

console.log(c);

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
    else
        console.log(body);
});