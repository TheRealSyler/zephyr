import { Injectable } from '@nestjs/common';
import { Password } from 'suf-password';

@Injectable()
export class AuthService {
  checkPassword(password: string) {
    const res = Password.Validate(password, [{ type: 'uppercase' }, { type: 'symbols' }], {
      maxLength: 255,
      minLength: 7
    });
    if (!res.passed) {
      return res.errors;
    }
    return [];
  }
}
