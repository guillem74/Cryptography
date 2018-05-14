'use strict';

const nr = require('./nonrepudiation');



const a = "A"
const b = "B"
const c = "C"

const array = new Array(a, b, c);
const concat = array.join(',');

nr.proof(concat);