'use strict';

const bignum = require ('bignum');
const crypto = require('crypto');
const rsa = require('../RSA/rsa');
/*
Non-repudiation protocol with an unreliable channel and
non-honest identities consists in:

Proof of origin: Po = [H(A, B, C)] from A
Proof of reception: Pr = [H(B, A, C)] from B
Proof of origin of K: Pko = [H(A, TTP, B, K)] from A
Proof of publication of K: Pkp = [H(TTP, A, B, K)] from TTP

where A and B are origin and destination nodes, and TTP is an intermediary
 */

const {publicKey, privateKey} = rsa.generateRandomKeys(512);


const proof = function (array){

    const hash = crypto.createHash('sha256').update(array).digest('hex');
    const bn = bignum(hash);
    const signed = privateKey.sign(bn);
    console.log(signed)
};


module.exports = {
    proof: proof

};

