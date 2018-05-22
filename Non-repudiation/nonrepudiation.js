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

    const concat = array.join(',');
    const hash = crypto.createHash('sha256').update(concat).digest();
    const bn = bignum.fromBuffer(hash);
    const privateK = rsa.privateKey(key);
    const signed = privateK.sign(bn);
    return signed;
};

const check = function (proof, key, array){

    const pubKey = rsa.publicKey(key);
    const check = pubKey.verify(proof);

    const concat = array.join(',');
    const hash = crypto.createHash('sha256').update(concat).digest();
    const bn = bignum.fromBuffer(hash);

    if (check.cmp(bn) == 0) return true;
    return false;
};


module.exports = {
    proof: proof,
    check: check

};

