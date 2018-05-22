const ss = require('./secret-sharing');


const keys = ss.shareSecret(4, 6, 888888);

console.log(keys);

const combined = [keys[0], keys[1], keys[3], keys[5]];


//combine some keys
console.log(ss.combineKeys(combined));