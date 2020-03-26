import { Password } from 'suf-password';

/**Check if the password is Strong. */
export function checkIsPasswordStrong(password: string) {
  const res = Password.Validate(password, [{ type: 'uppercase' }, { type: 'numbers' }], {
    maxLength: 255,
    minLength: 7
  });
  if (!res.passed) {
    return res.errors;
  }
  return [];
}

export enum UserRole {
  'DEFAULT',
  'CONTRIBUTOR',
  'ADMIN'
}

export interface RefreshTokenPayload {
  username: string;
  tokenVersion: number;
}
export interface AccessTokenPayload {
  username: string;
  role: UserRole;
}
