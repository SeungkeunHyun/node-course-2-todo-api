const {
    SHA256
} = require('crypto-js');
const jwt = require('jsonwebtoken');

var data = {
    id: 10
};
var token = jwt.sign(data, '123abc');
var decoded = jwt.verify(token, '123abcd');
console.log(token)
console.log(decoded);
//jwt.verify(token, '123abc');