import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Appointment } from '../appointments/appointment.entity';

@ObjectType()
@Entity('psychologists')
export class Psychologist {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ length: 100 })
  firstName: string;

  @Field()
  @Column({ length: 100 })
  lastName: string;

  @Field()
  @Column({ unique: true })
  email: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  phone?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  specialty?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  description?: string;

  @Field()
  @Column()
  googleCalendarId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  serviceAccountKeyPath?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  calendarColor?: string;

  @Field()
  @Column({ default: true })
  active: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => [Appointment], { nullable: true })
  @OneToMany(() => Appointment, appointment => appointment.psychologist)
  appointments?: Appointment[];
} 