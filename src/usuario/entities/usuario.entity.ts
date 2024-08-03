import { Transform, TransformFnParams } from 'class-transformer';
import { IsDateString, IsEmail, IsNotEmpty } from 'class-validator';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Produto } from '../../produto/entities/produto.entity';

@Entity({ name: 'tb_usuarios' })
export class Usuario {
  @PrimaryGeneratedColumn()
  id: number;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @Column({ length: 255, nullable: false })
  nome: string;

  @Column({ type: 'date', nullable: false })
  dataNascimento: Date;

  @IsEmail()
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  usuario: string;

  @Transform(({ value }: TransformFnParams) => value?.trim())
  @IsNotEmpty()
  @Column({ length: 100, nullable: false })
  senha: string;

  @Column({ length: 1000 })
  foto: string;

  @OneToMany(() => Produto, (produto) => produto.usuario)
  produto: Produto[];
}
