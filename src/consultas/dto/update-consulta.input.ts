import { InputType, Field, PartialType } from '@nestjs/graphql';
import { CreateConsultaInput } from './create-consulta.input';

@InputType()
export class UpdateConsultaInput extends PartialType(CreateConsultaInput) {} 