import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { ObjectType, Field, ID, Int } from '@nestjs/graphql';
import { Appointment } from '../appointments/appointment.entity';

@ObjectType()
@Schema({ timestamps: true })
export class Psychologist extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true, maxlength: 100 })
  firstName: string;

  @Field()
  @Prop({ required: true, maxlength: 100 })
  lastName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field({ nullable: true })
  @Prop()
  phone?: string;

  @Field({ nullable: true })
  @Prop()
  specialty?: string;

  @Field({ nullable: true })
  @Prop()
  description?: string;

  @Field()
  @Prop({ required: true })
  googleCalendarId: string;

  @Field({ nullable: true })
  @Prop()
  serviceAccountKeyPath?: string;

  @Field({ nullable: true })
  @Prop()
  calendarColor?: string;

  @Field()
  @Prop({ default: true })
  active: boolean;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Appointment], { nullable: true })
  appointments?: Appointment[];

  @Field(() => Int)
  appointmentsCount: number;

  @Field()
  fullName: string;
}

export const PsychologistSchema = SchemaFactory.createForClass(Psychologist);

// Create virtual for appointments
PsychologistSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'psychologistId',
});

// Transform to include virtual fields
PsychologistSchema.set('toJSON', { virtuals: true });
PsychologistSchema.set('toObject', { virtuals: true }); 