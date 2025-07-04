import { ObjectType, Field, ID, registerEnumType } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { User } from '../users/user.entity';
import { Psychologist } from '../psychologists/psychologist.entity';

export enum AppointmentType {
  ONLINE = 'ONLINE',
  IN_PERSON = 'IN_PERSON'
}

registerEnumType(AppointmentType, {
  name: 'AppointmentType',
  description: 'Type of appointment (online or in person)',
});

@ObjectType()
@Schema({ timestamps: true })
export class Appointment extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true })
  date: Date;

  @Field()
  @Prop({ required: true })
  time: string;

  @Field(() => AppointmentType)
  @Prop({
    type: String,
    enum: AppointmentType,
    default: AppointmentType.IN_PERSON
  })
  type: AppointmentType;

  @Field()
  @Prop({ required: true })
  reason: string;

  @Field()
  @Prop({ default: false })
  confirmed: boolean;

  @Field()
  @Prop({ default: false })
  cancelled: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => User)
  user: User;

  @Field()
  @Prop({ type: Types.ObjectId, ref: 'User', required: true })
  userId: string;

  @Field(() => Psychologist)
  psychologist: Psychologist;

  @Field()
  @Prop({ type: Types.ObjectId, ref: 'Psychologist', required: true })
  psychologistId: string;

  @Field({ nullable: true })
  @Prop()
  googleEventId?: string;

  @Field({ nullable: true })
  @Prop()
  googleMeetLink?: string;
}

export const AppointmentSchema = SchemaFactory.createForClass(Appointment);

// Create virtual for user
AppointmentSchema.virtual('user', {
  ref: 'User',
  localField: 'userId',
  foreignField: '_id',
  justOne: true,
});

// Create virtual for psychologist
AppointmentSchema.virtual('psychologist', {
  ref: 'Psychologist',
  localField: 'psychologistId',
  foreignField: '_id',
  justOne: true,
});

// Transform to include virtual fields
AppointmentSchema.set('toJSON', { virtuals: true });
AppointmentSchema.set('toObject', { virtuals: true }); 