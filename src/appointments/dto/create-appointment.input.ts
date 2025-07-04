import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDateString, IsEnum, IsUUID, Matches } from 'class-validator';
import { AppointmentType } from '../appointment.entity';

@InputType()
export class CreateAppointmentInput {
  @Field()
  @IsNotEmpty({ message: 'Date is required' })
  @IsDateString({}, { message: 'Date must have a valid format (YYYY-MM-DD)' })
  date: string;

  @Field()
  @IsNotEmpty({ message: 'Time is required' })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
    message: 'Time must have the format HH:MM' 
  })
  time: string;

  @Field(() => AppointmentType)
  @IsEnum(AppointmentType, { message: 'Type must be online or in_person' })
  type: AppointmentType;

  @Field()
  @IsNotEmpty({ message: 'Reason for appointment is required' })
  @IsString()
  reason: string;

  @Field()
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID()
  userId: string;

  @Field()
  @IsNotEmpty({ message: 'Psychologist ID is required' })
  @IsUUID()
  psychologistId: string;
} 