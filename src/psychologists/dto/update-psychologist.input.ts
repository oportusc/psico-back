import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreatePsychologistInput } from './create-psychologist.input';

@InputType()
export class UpdatePsychologistInput extends PartialType(CreatePsychologistInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'Active field must be a boolean value' })
  active?: boolean;
} 