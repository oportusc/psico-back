import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { User } from '../users/user.entity';
import { Psychologist } from '../psychologists/psychologist.entity';

export enum AppointmentType {
  ONLINE = 'online',
  IN_PERSON = 'in_person'
}

registerEnumType(AppointmentType, {
  name: 'AppointmentType',
  description: 'Type of appointment (online or in person)',
});

@ObjectType()
@Entity()
export class Appointment {
  @Field(() => ID)
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field()
  @Column({ type: 'timestamp' })
  date: Date;

  @Field()
  @Column({ type: 'time' })
  time: string;

  @Field(() => AppointmentType)
  @Column({
    type: 'enum',
    enum: AppointmentType,
    default: AppointmentType.IN_PERSON
  })
  type: AppointmentType;

  @Field()
  @Column({ type: 'text' })
  reason: string;

  @Field()
  @Column({ default: false })
  confirmed: boolean;

  @Field()
  @Column({ default: false })
  cancelled: boolean;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

  @Field()
  @UpdateDateColumn()
  updatedAt: Date;

  @Field(() => User)
  @ManyToOne(() => User, user => user.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Field()
  @Column()
  userId: string;

  @Field(() => Psychologist)
  @ManyToOne(() => Psychologist, psychologist => psychologist.appointments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'psychologistId' })
  psychologist: Psychologist;

  @Field()
  @Column()
  psychologistId: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleEventId?: string;

  @Field({ nullable: true })
  @Column({ nullable: true })
  googleMeetLink?: string;
} 