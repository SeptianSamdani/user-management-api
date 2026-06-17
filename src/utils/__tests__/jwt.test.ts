import { generateAccessToken, verifyAccessToken, generateRefreshToken, verifyRefreshToken } from '../jwt';
import { Role } from '../../types';

describe('JWT utils', () => {
  const payload = { userId: '123', email: 'test@test.com', role: Role.USER };

  it('generates and verifies access token', () => {
    const decoded = verifyAccessToken(generateAccessToken(payload));
    expect(decoded.userId).toBe(payload.userId);
  });

  it('generates and verifies refresh token', () => {
    const decoded = verifyRefreshToken(generateRefreshToken(payload));
    expect(decoded.userId).toBe(payload.userId);
  });

  it('throws on invalid token', () => {
    expect(() => verifyAccessToken('invalid.token.here')).toThrow();
  });
});