import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

@InputType()
export class CreateUserInput {
  @Field()
  @IsNotEmpty({ message: 'RUT is required' })
  @IsString()
  @Matches(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/, { 
    message: 'RUT must have the format XX.XXX.XXX-X' 
  })
  rut: string;

  @Field()
  @IsNotEmpty({ message: 'First name is required' })
  @IsString()
  firstName: string;

  @Field()
  @IsNotEmpty({ message: 'Last name is required' })
  @IsString()
  lastName: string;

  @Field()
  @IsEmail({}, { message: 'Email must have a valid format' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @Field()
  @IsNotEmpty({ message: 'Phone is required' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { 
    message: 'Phone must have a valid format' 
  })
  phone: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  address?: string;
} 