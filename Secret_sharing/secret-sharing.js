'use strict';

const bignum = require('bignum');

/*

   t - Keys needed to recover secret
   n - Number of total keys
   secret - Secret
   bits - Number of bits of p. Default 1024
 */
const share = function (t, n, secret, bits = 1024) {
    let keys = [];
    const degree = t - 1;
    let polCoef = [];
    //secret to bignum
    const s = bignum(secret);
    //Position 0 of the polinomy array is the secret
    polCoef.push(s);
    //Generate prime p with length bits
    const p = bignum.prime(bits);

    //Generate rand coeficients of the polinomy
    for (let j = 0; j < degree; j++) {
        polCoef.push(s.rand());
    }

    //calculate the different keys using the polinomy
    let i = 1;
    for (let j = 0; j < n; j++) {
        const x = bignum(j + 1);
        let key = polCoef.reduce((sum, next) => {
            let z = sum.add(next.mul(x.pow(bignum(i))));
            i++;
            return z;
        });

        key = key.mod(p);
        keys.push(new Key(x, key, p));
        i = 1;
    }


    return keys;

};

/*
    keys - Array with the keys to get the secret. [Key{x: "x", key:"key", p:"p"}]

 */

const combine = function (keys = []) {
    let coef = [];
    const p = bignum(keys[0].p, 16);

    //calculate the coeficients to get the secret
    for (let i = 0; i < keys.length; i++) {
        let num = bignum(1);
        let den = bignum(1);
        let j = 0;
        keys.reduce((sum, next) => {

            if (j != i) {
                const xTemp = bignum(next.x, 16);
                const xoTemp = bignum(keys[i].x, 16);
                const sub = xTemp.sub(xoTemp);
                num = num.mul(xTemp);
                den = den.mul(sub);
            }

            j++;
            return 1;
            //return 1;
        }, 1);

        num = num.mul(bignum(keys[i].key, 16));
        while (den.lt(bignum(0))) {
            den = den.add(p);
        }
        const inv = den.invertm(p);
        coef.push((num.mul(inv)).mod(p));
    }

    //combine the coefficients to get the secret
    const sTemp = coef.reduce((sum, next) => {
        const z = sum.add(next);
        return z;
    });

    const secret = sTemp.mod(p).toString(10);
    return secret
};

const Key = class Key {

    constructor(x, key, p) {
        this.x = x.toString(16);
        this.key = key.toString(16);
        this.p = p.toString(16);
    }
};

module.exports = {
    shareSecret: share,
    combineKeys: combine
};
