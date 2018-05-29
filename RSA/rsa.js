'use strict';

const bignum = require('bignum');

const generateRandomKeys = (bitLength = 2048) => {

    //Generate p, q
    const p = bignum.prime(bitLength, true);
    const q = bignum.prime(bitLength, true);

    //Public parameters
    const n = p.mul(q);
    const e = bignum(65537);

    //Private parameters
    const phi = (p.sub(1)).mul(q.sub(1));
    const d = e.invertm(phi);


    const publicKey = new RSAPublicKey(e, n);
    const privateKey = new RSAPrivateKey(d,n);

    return { publicKey, privateKey };

};

const privateKey = function (key) {
    return new RSAPrivateKey(key.d, key.n);
};

const publicKey = function (key) {
    return new RSAPublicKey(key.e, key.n);
};

const RSAPublicKey = class RSAPublicKey {
    constructor(e, n) {
        this.e = e.toString(16);
        this.n = n.toString(16);
    }

    encrypt(msg) {
        //convert string to numeric
        //ecrypt numeric message
        const enc = msg.powm(bignum(this.e, 16), bignum(this.n, 16));

        return enc.toString(16);
    }


    verify(msg) {

        //decrypt message in numeric format
        const deNum = msg.powm(bignum(this.e, 16), bignum(this.n, 16));
        //convert message decrypted to string
        return deNum;
    }
};

const RSAPrivateKey = class RSAPrivateKey {

    constructor(d, n) {
        this.d = d.toString(16);
        this.n = n.toString(16);
    }

    //mssg is a string
    sign(msg) {
        //convert string to numeric

        //ecrypt numeric message
        const enc = msg.powm(bignum(this.d, 16), bignum(this.n, 16));

        return enc.toString(16);
    }

    //mssg is a bignum in base 16
    decrypt(msg) {

        const deNum = msg.powm(bignum(this.d, 16), bignum(this.n, 16));
        //convert message decrypted to string
        return deNum;
    }
};

module.exports = {
    generateRandomKeys: generateRandomKeys,
    publicKey: publicKey,
    privateKey: privateKey,
    RSAPublicKey: RSAPublicKey,
    RSAPrivateKey: RSAPrivateKey
};