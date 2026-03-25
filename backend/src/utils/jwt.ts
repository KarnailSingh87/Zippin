import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'changeme';

export function sign(payload: object, expiresIn: string | number = '15m') {
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verify(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
