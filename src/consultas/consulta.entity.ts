import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';

export enum TipoConsulta {
  ONLINE = 'online',
  PRESENCIAL = 'presencial'
}

@ObjectType()
@Entity()
export class Consulta {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'date' })
  fecha: Date;

  @Field()
  @Column({ type: 'time' })
  hora: string;

  @Field()
  @Column({
    type: 'enum',
    enum: TipoConsulta,
    default: TipoConsulta.PRESENCIAL
  })
  tipo: TipoConsulta;

  @Field()
  @Column({ type: 'text' })
  motivo: string;

  @Field()
  @Column({ default: false })
  confirmada: boolean;

  @Field()
  @Column({ default: false })
  cancelada: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => Usuario)
  @ManyToOne(() => Usuario, usuario => usuario.consultas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'usuarioId' })
  usuario: Usuario;

  @Field()
  @Column()
  usuarioId: string;
} 