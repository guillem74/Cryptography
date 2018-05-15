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



const proof = function (array, key){

    const hash = crypto.createHash('sha256').update(array).digest('hex');
    const buff = Buffer.from(hash);
    const bn = bignum.fromBuffer(buff);
    const privateK = rsa.privateKey(key);
    const signed = privateK.sign(bn);
    return signed;
};

const check = function (array){
    const hash = crypto.createHash('sha256').update(array).digest('hex');
    const buff = Buffer.from(hash);
    const bn = bignum.fromBuffer(buff);
    return bn;
};


module.exports = {
    proof: proof,
    check: check

};

