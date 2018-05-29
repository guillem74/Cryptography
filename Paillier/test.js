'use strict';
const paillier = require('./paillier');
const bignum = require('bignum');

const { publicKey, privateKey } = paillier.generateRandomKeys(512); // Change to at least 2048 bits in production state


let num1 = 2;
let num2 = 4;
let num3 = 6;
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

let decryptedSum = privateKey.decrypt(encryptedSum);
console.log('Sum:', decryptedSum.toString());

