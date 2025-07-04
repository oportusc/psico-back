import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreatePsychologistInput {
  @Field()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString({ message: 'First name must be a string' })
  @MaxLength(100, { message: 'First name cannot exceed 100 characters' })
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString({ message: 'Last name must be a string' })
  @MaxLength(100, { message: 'Last name cannot exceed 100 characters' })
  lastName: string;

  @Field()
  @IsNotEmpty({ message: 'Email is required' })
  @IsEmail({}, { message: 'Email must have a valid format' })
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Phone must be a string' })
  phone?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Specialty must be a string' })
  specialty?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Description must be a string' })
  description?: string;

  @Field()
  @IsNotEmpty({ message: 'Google Calendar ID is required' })
  @IsString({ message: 'Google Calendar ID must be a string' })
  googleCalendarId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Service Account key path must be a string' })
  serviceAccountKeyPath?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'Calendar color must be a string' })
  calendarColor?: string;
} 