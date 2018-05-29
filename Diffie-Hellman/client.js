    const request = require('request');
    const bigInt = require ('big-integer');
    const crypto = require ('crypto');
    const dh = require ('./dh');

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

                const p = bigInt(r.p, 16);
                const g = bigInt(r.g, 16);
                const A = bigInt(r.A, 16);

                const dhParams = new dh.DH(p, g);

                const dhKey = dhParams.sharedKey(A);

                const key = Buffer.from(dhKey.toString(16), 'hex').slice(0, 32);

                const iv = Buffer.from(crypto.randomBytes(16));

                //Encrypt message
                const cipher = crypto.createCipheriv('aes256', key, iv);
                let encrypted = cipher.update(text, 'utf8', 'hex');
                encrypted += cipher.final('hex');

                let  message = {};
                message.message = encrypted;
                message.B = dhParams.A;
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
