import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { ProdutoService } from '../services/produto.service';
import { Produto } from '../entities/produto.entity';
import { DeleteResult } from 'typeorm';
import { JwtAuthGuard } from '../../auth/guard/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('/produtos')
export class ProdutoController {
  constructor(readonly produtoService: ProdutoService) {}

  @Get()
  @HttpCode(HttpStatus.OK)
  findAll(): Promise<Produto[]> {
    return this.produtoService.findAll();
  }

  @Get('/:id')
  @HttpCode(HttpStatus.OK)
  findById(@Param('id', ParseIntPipe) id: number): Promise<Produto> {
    return this.produtoService.findById(id);
  }

  @Get('/titulo/:titulo')
  @HttpCode(HttpStatus.OK)
  findByTitle(@Param('titulo') titulo: string): Promise<Produto[]> {
    return this.produtoService.findByTitle(titulo);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  create(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.create(produto);
  }

  @Put()
  @HttpCode(HttpStatus.OK)
  update(@Body() produto: Produto): Promise<Produto> {
    return this.produtoService.update(produto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('id', ParseIntPipe) id: number): Promise<DeleteResult> {
    return this.produtoService.delete(id);
  }

  @Get('/filtro/maior/:preco')
  @HttpCode(HttpStatus.OK)
  findByMore(@Param('preco', ParseIntPipe) preco: number): Promise<Produto[]> {
    return this.produtoService.findByMore(preco);
  }

  @Get('/filtro/menor/:preco')
  @HttpCode(HttpStatus.OK)
  findByLess(@Param('preco', ParseIntPipe) preco: number) {
    return this.produtoService.findByLess(preco);
  }
}
