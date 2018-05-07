'use strict';

const bignum = require ('bignum');
const bcrypt = require ('bcrypt');

/*
Non-repudiation protocol with an unreliable channel and
non-honest identities consists in:

Proof of origin: Po = [H(A, B, C)] from A
Proof of reception: Pr = [H(B, A, C)] from B
Proof of origin of K: Pko = [H(A, TTP, B, K)] from A
Proof of publication of K: Pkp = [H(TTP, A, B, K)] from TTP

where A and B are origin and destination nodes, and TTP is an intermediary
 */

const proofOrigin = function (A, B, C, kPrivate){
    /*
    We apply a hash function to A, B and C
    Finally, the hash is signed with A's private key
     */
    const buff = Buffer.concat([A, B, C]);
    const hash = bcrypt.hashSync(buff, 10);
};

const proofReception = function(B, A, C, kPrivate){
    /*
    We apply a hash function to B, A and C
    Afterwards, the hash is signed with B's private key
     */
};


