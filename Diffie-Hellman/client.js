    const request = require('request');
    const bigInt = require ('big-integer');
    const crypto = require ('crypto');

    const text = "Diffie-Hellman negotiation";

    request({
        uri: 'http://localhost:3000/key',
           method: "GET",
           timeout: 10000,
           followRedirect: true,
           maxRedirects: 10
       },

       function(error, response, body) {

            if (error)
                console.log("GET error");
            else{
                const r = JSON.parse(body);

                const p = bigInt(r.p);
                const g = bigInt(r.g);
                const A = bigInt(r.A);

                const b = bigInt(bigInt.randBetween(2, p.minus(1)));
                const B = bigInt(g.modPow(b,p));

                //Generate key
                const key = bigInt(A.modPow(b,p));

                const iv = crypto.randomBytes(16);

                //Encrypt message
                const cipher = crypto.createCipher('aes256', key.toString(16), iv);
                let encrypted = cipher.update(text, 'utf8', 'hex');
                encrypted += cipher.final('hex');

                let  message = {};
                message.message = encrypted;
                message.B = B;
                message.iv = iv;

                request({
                    url: 'http://localhost:3000/message',
                    method: 'POST',
                    body: message,
                    json: true
                }, function(error, response, body){
                    if (error)
                        console.log("POST error");
                    else
                      console.log(body);
                });

            }

        });
