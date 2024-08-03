import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class Bcrypt {
  async encryptPassword(password: string): Promise<string> {
    let heels: number = 10;

    return await bcrypt.hash(password, heels);
  }

  async comparePassword(
    passwordEntered: string,
    passwordDB: string,
  ): Promise<boolean> {
    return await bcrypt.compare(passwordEntered, passwordDB);
  }
}
