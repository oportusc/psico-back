import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';
import { Appointment } from '../appointments/appointment.entity';

@ObjectType()
@Schema({ timestamps: true })
export class User extends Document {
  @Field(() => ID)
  declare id: string;

  @Field()
  @Prop({ required: true, unique: true })
  rut: string;

  @Field()
  @Prop({ required: true })
  firstName: string;

  @Field()
  @Prop({ required: true })
  lastName: string;

  @Field()
  @Prop({ required: true, unique: true })
  email: string;

  @Field()
  @Prop({ required: true })
  phone: string;

  @Field({ nullable: true })
  @Prop()
  address?: string;

  @Field()
  createdAt: Date;

  @Field()
  updatedAt: Date;

  @Field(() => [Appointment], { nullable: true })
  appointments?: Appointment[];
}

export const UserSchema = SchemaFactory.createForClass(User);

// Create virtual for appointments
UserSchema.virtual('appointments', {
  ref: 'Appointment',
  localField: '_id',
  foreignField: 'userId',
});

// Transform to include virtual fields
UserSchema.set('toJSON', { virtuals: true });
UserSchema.set('toObject', { virtuals: true }); 