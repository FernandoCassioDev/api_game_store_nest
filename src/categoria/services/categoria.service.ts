import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Categoria } from '../entities/categoria.entity';
import { DeleteResult, ILike, Repository } from 'typeorm';

@Injectable()
export class CategoriaService {
  constructor(
    @InjectRepository(Categoria)
    private categoriaRepository: Repository<Categoria>,
  ) {}

  async findAll(): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      relations: {
        produto: true,
      },
    });
  }

  async findById(id: number): Promise<Categoria> {
    let buscaCategoria = await this.categoriaRepository.findOne({
      where: {
        id,
      },
      relations: {
        produto: true,
      },
    });
    if (!buscaCategoria)
      throw new HttpException('Categoria não encontrado', HttpStatus.NOT_FOUND);

    return buscaCategoria;
  }

  async findByType(tipo: string): Promise<Categoria[]> {
    return await this.categoriaRepository.find({
      where: {
        tipo: ILike(`%${tipo}%`),
      },
      relations: {
        produto: true,
      },
    });
  }

  async create(categoria: Categoria): Promise<Categoria> {
    return await this.categoriaRepository.save(categoria);
  }

  async update(categoria: Categoria): Promise<Categoria> {
    let buscaCategoria = await this.findById(categoria.id);

    if (!buscaCategoria || !categoria.id)
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);

    return await this.categoriaRepository.save(categoria);
  }

  async delete(id: number): Promise<DeleteResult> {
    let buscaCategoria = this.findById(id);

    if (!buscaCategoria)
      throw new HttpException('Categoria não encontrada', HttpStatus.NOT_FOUND);

    return await this.categoriaRepository.delete(id);
  }
}
