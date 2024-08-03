import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Usuario } from '../entities/usuario.entity';
import { Bcrypt } from '../../auth/bcrypt/bcrypt';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(Usuario)
    private usuarioRepository: Repository<Usuario>,
    private bcrypt: Bcrypt,
  ) {}

  async findByUser(user: string): Promise<Usuario | undefined> {
    return await this.usuarioRepository.findOne({
      where: {
        usuario: user,
      },
    });
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuarioRepository.find({
      relations: {
        produto: true,
      },
    });
  }

  async findById(id: number): Promise<Usuario> {
    let user = await this.usuarioRepository.findOne({
      where: {
        id,
      },
    });

    if (!user)
      throw new HttpException('Usuario não encontrado', HttpStatus.NOT_FOUND);

    return user;
  }

  async create(user: Usuario): Promise<Usuario> {
    let findUser = await this.findByUser(user.usuario);
    let age = this.legalAge(user.dataNascimento);

    if (!age)
      throw new HttpException(
        'Você deve ter pelo menos 18 anos para se cadastrar',
        HttpStatus.UNAUTHORIZED,
      );

    if (!findUser) {
      user.senha = await this.bcrypt.encryptPassword(user.senha);
      return await this.usuarioRepository.save(user);
    }

    throw new HttpException('O usuario já existe', HttpStatus.BAD_REQUEST);
  }

  async update(user: Usuario): Promise<Usuario> {
    let updateUser: Usuario = await this.findById(user.id);
    let buscaUsuario = await this.findByUser(user.usuario);

    if (!updateUser)
      throw new HttpException('Usuario não encontrado!', HttpStatus.NOT_FOUND);

    if (buscaUsuario && buscaUsuario.id !== user.id)
      throw new HttpException(
        'Usuario (E-mail) já cadastrado!',
        HttpStatus.BAD_REQUEST,
      );

    user.senha = await this.bcrypt.encryptPassword(user.senha);
    return await this.usuarioRepository.save(user);
  }

  public legalAge(date: Date): boolean {
    const today = new Date();
    const birthDate = new Date(date);

    const age = today.getFullYear() - birthDate.getFullYear();
    const monthDif = today.getMonth() - birthDate.getMonth();
    const dayDif = today.getDate() - birthDate.getDate();

    if (age > 18) return true;
    else if (age === 18) {
      if (monthDif > 0) return true;

      if (monthDif === 0 && dayDif >= 0) {
        return true;
      }
    }

    return false;
  }
}
