import { InputType, Field, PartialType } from '@nestjs/graphql';
import { IsOptional, IsBoolean } from 'class-validator';
import { CreatePsicologoInput } from './create-psicologo.input';

@InputType()
export class UpdatePsicologoInput extends PartialType(CreatePsicologoInput) {
  @Field({ nullable: true })
  @IsOptional()
  @IsBoolean({ message: 'El campo activo debe ser un valor booleano' })
  activo?: boolean;
} 