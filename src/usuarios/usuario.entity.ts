import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Consulta } from '../consultas/consulta.entity';

@ObjectType()
@Entity()
export class Usuario {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ unique: true })
  rut: string;

  @Field()
  @Column()
  nombre: string;

  @Field()
  @Column()
  apellidos: string;

  @Field()
  @Column({ unique: true })
  correo: string;

  @Field()
  @Column()
  telefono: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  direccion?: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Consulta], { nullable: true })
  @OneToMany(() => Consulta, consulta => consulta.usuario)
  consultas?: Consulta[];
} 