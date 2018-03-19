const request = require('request');
const bignum = require ('bignum');



request({
        uri: 'http://localhost:3000/a',
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
            console.log(e);
            console.log(n);

        }

    });