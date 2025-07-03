import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Consulta } from '../consultas/consulta.entity';

@ObjectType()
@Entity('psicologos')
export class Psicologo {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 100 })
  nombre: string;

  @Field()
  @Column({ length: 100 })
  apellidos: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  telefono?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  especialidad?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  descripcion?: string;

  @Field()
  @Column()
  googleCalendarId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  serviceAccountKeyPath?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  colorCalendario?: string;

  @Field()
  @Column({ default: true })
  activo: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Consulta], { nullable: true })
  @OneToMany(() => Consulta, consulta => consulta.psicologo)
  consultas?: Consulta[];
} 