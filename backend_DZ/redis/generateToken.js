const jwt = require('jsonwebtoken');

const secret = 'secret-key';

function generateToken(userId) {
  const payload = { userId };
  const options = { expiresIn: '5m' };
  return jwt.sign(payload, secret, options);
}

console.log('JWT для testUser123:', generateToken('testUser123'));
console.log('JWT для testUser456:', generateToken('testUser456'));