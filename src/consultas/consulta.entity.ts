import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { Usuario } from '../usuarios/usuario.entity';
import { Psicologo } from '../psicologos/psicologo.entity';

export enum TipoConsulta {
  ONLINE = 'online',
  PRESENCIAL = 'presencial'
}

registerEnumType(TipoConsulta, {
  name: 'TipoConsulta',
  description: 'Tipo de consulta (online o presencial)',
});

@ObjectType()
@Entity()
export class Consulta {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'timestamp' })
  fecha: Date;

  @Field()
  @Column({ type: 'time' })
  hora: string;

  @Field(() => TipoConsulta)
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

  @Field(() => Psicologo)
  @ManyToOne(() => Psicologo, psicologo => psicologo.consultas, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'psicologoId' })
  psicologo: Psicologo;

  @Field()
  @Column()
  psicologoId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleEventId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleMeetLink?: string;
} 