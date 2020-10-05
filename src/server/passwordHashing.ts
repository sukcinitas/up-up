import { compareSync, hashSync } from 'bcryptjs';

export function hashPassword(password: string): string {
  return hashSync(password, 10);
}

export function comparePassword(assumedPassword: string, hashedPassword: string): boolean {
  return compareSync(assumedPassword, hashedPassword);
}
