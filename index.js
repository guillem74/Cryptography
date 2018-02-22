
        const bigInt = require('big-integer');
        const crypto = require('crypto');

        var p = new bigInt(4);
        var g = new bigInt(2);

        while (!bigInt(p).isPrime()){

            p = bigInt.randBetween(bigInt(2).pow(511), bigInt(2).pow(512).minus(1))

        }

        var p2 = bigInt(p).minus(1);

        var a = bigInt(bigInt.randBetween(2, p2));
        var b = bigInt(bigInt.randBetween(2, p2));

        var ga = bigInt(g).modPow(a, p);
        var gb = bigInt(g).modPow(b, p);

        var Kab = bigInt(gb).modPow(a, p);
        var Kba = bigInt(ga).modPow(b, p);

        if (bigInt(Kab).equals(Kba)){
            console.log("Diffie-Hellman is working!")
        }
        else{
            console.log("Failure")
        }




