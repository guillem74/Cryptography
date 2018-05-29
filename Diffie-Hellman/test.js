"use strict";

const bigInt = require('big-integer');
const dh = require('./dh.js');
const crypto = require('crypto');

const param = new dh.DH(dh.DH.getDHParams(), 2);
