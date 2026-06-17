import { hashPassword, comparePassword } from '../password';

describe('Password utils', () => {
  it('hashes password and verifies match', async () => {
    const hashed = await hashPassword('Secret123');
    expect(hashed).not.toBe('Secret123');
    await expect(comparePassword('Secret123', hashed)).resolves.toBe(true);
  });

  it('rejects wrong password', async () => {
    const hashed = await hashPassword('Secret123');
    await expect(comparePassword('WrongPass1', hashed)).resolves.toBe(false);
  });
});