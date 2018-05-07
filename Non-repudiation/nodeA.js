'use strict';

const nr = require('./nonrepudiation');

const a = "A"
const b = "B"
const c = "C"
const d = "D"
const e = Buffer.from('a', 'utf8');




nr.proof(a, b, c, d);