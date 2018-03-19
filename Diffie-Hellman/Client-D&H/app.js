    const request = require('request');
    const bigInt = require ('big-integer');
    const crypto = require ('crypto');

    var text = "Diffie-Hellman negotiation";

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
                var r = JSON.parse(body)

                var p = bigInt(r.p);
                var g = bigInt(r.g);
                var A = bigInt(r.A);

                var b = bigInt(bigInt.randBetween(2, p.minus(1)));
                var B = bigInt(g.modPow(b,p));

                //Generate key
                var key = bigInt(A.modPow(b,p));

                //Encrypt message
                var cipher = crypto.createCipher('aes192', key.toString(16));
                var encrypted = cipher.update(text, 'utf8', 'hex');
                encrypted += cipher.final('hex');

                var  message = {};
                message.message = encrypted;
                message.B = B;

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
