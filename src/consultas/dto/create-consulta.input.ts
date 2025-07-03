import { InputType, Field } from '@nestjs/graphql';
import { IsNotEmpty, IsString, IsDateString, IsEnum, IsUUID, Matches } from 'class-validator';
import { TipoConsulta } from '../consulta.entity';

@InputType()
export class CreateConsultaInput {
  @Field()
  @IsNotEmpty({ message: 'La fecha es requerida' })
  @IsDateString({}, { message: 'La fecha debe tener un formato válido (YYYY-MM-DD)' })
  fecha: string;

  @Field()
  @IsNotEmpty({ message: 'La hora es requerida' })
  @IsString()
  @Matches(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, { 
    message: 'La hora debe tener el formato HH:MM' 
  })
  hora: string;

  @Field(() => TipoConsulta)
  @IsEnum(TipoConsulta, { message: 'El tipo debe ser online o presencial' })
  tipo: TipoConsulta;

  @Field()
  @IsNotEmpty({ message: 'El motivo de consulta es requerido' })
  @IsString()
  motivo: string;

  @Field()
  @IsNotEmpty({ message: 'El ID del usuario es requerido' })
  @IsUUID()
  usuarioId: string;
} 