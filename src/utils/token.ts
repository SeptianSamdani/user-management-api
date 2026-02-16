import crypto from 'crypto';

export const generateToken = (): string => {
  return crypto.randomBytes(32).toString('hex');
};

export const generateTokenWithExpiry = (hours: number = 24): { token: string; expiry: Date } => {
  const token = generateToken();
  const expiry = new Date();
  expiry.setHours(expiry.getHours() + hours);
  
  return { token, expiry };
};