import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsuarioService } from '../../usuario/services/usuario.service';
import { JwtService } from '@nestjs/jwt';
import { Bcrypt } from '../bcrypt/bcrypt';
import { UserLogin } from '../entities/userlogin.entity';

@Injectable()
export class AuthService {
  constructor(
    private usuarioService: UsuarioService,
    private jwtService: JwtService,
    private bcrypt: Bcrypt,
  ) {}

  async validateUser(username: string, password: string): Promise<any> {
    const findUser = await this.usuarioService.findByUser(username);

    if (!findUser)
      throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);

    const matchPassword = await this.bcrypt.comparePassword(
      password,
      findUser.senha,
    );

    if (findUser && matchPassword) {
      const { senha, ...resposta } = findUser;
      return resposta;
    }

    return null;
  }

  async login(userLogin: UserLogin) {
    const payload = { sub: userLogin.user };

    const findUser = await this.usuarioService.findByUser(userLogin.user);

    return {
      id: findUser.id,
      name: findUser.nome,
      user: findUser.usuario,
      foto: findUser.foto,
      token: `Bearer ${this.jwtService.sign(payload)}`,
    };
  }
}
