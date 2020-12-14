import { compareSync, hashSync } from 'bcryptjs';

const pepperCode = '7510016265 7204971188';
const pepperEnv = process.env.PEPPER;
const pepper = `${pepperCode}${pepperEnv}`;

export function hashPassword(password: string): string {
  return hashSync(`${password}${pepper}`, 10);
}

export function comparePassword(
  assumedPassword: string,
  hashedPassword: string,
): boolean {
  return compareSync(`${assumedPassword}${pepper}`, hashedPassword);
}
