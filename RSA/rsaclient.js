const request = require('request');
const bignum = require ('bignum');

m = bignum(8888);

request({
        uri: 'http://localhost:3000/public',
        method: "GET",
        timeout: 10000,
        followRedirect: true,
        maxRedirects: 10
    },

    function(error, response, body) {

        if (error)
            console.log("GET error");
        else{
            let r = JSON.parse(body);
            let e = bignum(r.e);
            let n = bignum(r.n);
            var message = {};
            let c = m.powm(e, n);
            message.c = c.toString();
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