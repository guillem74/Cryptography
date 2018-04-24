"use strict";

const bigInt = require ('big-integer');

const AliceParameters = function (){

    //Choose prime, generator, and bits
    let p = bigInt(4);
    const g = bigInt(2);
    const bits = bigInt(16);

    //Make p prime
    while (!p.isPrime()){

        p = bigInt.randBetween(bigInt(2).pow(bits.minus(1)), bigInt(2).pow(bits).minus(1))
    }

    //Select a random number between 2 and p-1
    const a = bigInt(bigInt.randBetween(2, p.minus(1)));

    //Compute A = g^aMod(p)
    const A = bigInt(g.modPow(a,p));

    //Return the parameters
    let parameters = {};
    parameters.p = p;
    parameters.g = g;
    parameters.a = a;
    parameters.A = A;

    return parameters;

};

const BobParameters = function (p, g){

    //Select a random number b
    const b = bigInt(bigInt.randBetween(2, p.minus(1)));

    //Compute B = g^bMod(p)
    const B = bigInt(g.modPow(b, p));

    let parameters = {};
    parameters.p = p;
    parameters.g = g;
    parameters.b = b;
    parameters.B = B;

    return parameters
};

const dhKeyAlice = function (B, a, p){

    //Computes K = B^aMod(p)
    const dhKeyA = bigInt(B.modPow(a, p));

    return dhKeyA
};

const dhKeyBob = function (A, b, p){

    //Computes K = A^bMod(p)
    const dhKeyB = bigInt(A.modPow(b, p));

    return dhKeyB
};

module.exports = {
    AliceParameters: AliceParameters,
    BobParameters: BobParameters,
    dhKeyAlice: dhKeyAlice,
    dhKeyBob: dhKeyBob

};
