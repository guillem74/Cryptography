'use strict';

const bignum = require ('bignum');
const crypto = require('crypto');

/*
Non-repudiation protocol with an unreliable channel and
non-honest identities consists in:

Proof of origin: Po = [H(A, B, C)] from A
Proof of reception: Pr = [H(B, A, C)] from B
Proof of origin of K: Pko = [H(A, TTP, B, K)] from A
Proof of publication of K: Pkp = [H(TTP, A, B, K)] from TTP

where A and B are origin and destination nodes, and TTP is an intermediary
 */

const proofOfOrigin = function (alice, bob, message, privateKey){

    const a = new Array(alice, bob, message);
    const concat = a.join(',');
    const hash = crypto.createHash('sha256').update(concat).digest('hex');

};

const proofOfReception = function(alice, bob, message, privateKey){

    const a = new Array(bob, alice, message);
    const concat = a.join(',');
    const hash = crypto.createHash('sha256').update(concat).digest('hex');

};

const proofOfOriginK = function(alice, ttp, bob, message, k, privateKey){

    const a = new Array(alice, ttp, bob, k);
    const concat = a.join(',');
    const hash = crypto.createHash('sha256').update(concat).digest('hex');

};

const proofOfPublicationK = function(alice, ttp, bob, message, k, privateKey){

    const a = new Array(ttp, alice, bob, k);
    const concat = a.join(',');
    const hash = crypto.createHash('sha256').update(concat).digest('hex');
};

module.exports = {
    proofOfOrigin: proofOfOrigin,
    proofOfReception: proofOfReception,
    proofOfOriginK: proofOfOriginK,
    proofOfPublicationK: proofOfPublicationK

};

