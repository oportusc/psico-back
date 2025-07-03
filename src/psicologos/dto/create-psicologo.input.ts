import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, MinLength, MaxLength } from 'class-validator';

@InputType()
export class CreatePsicologoInput {
  @Field()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @MaxLength(100, { message: 'El nombre no puede superar los 100 caracteres' })
  nombre: string;

  @Field()
  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  @IsString({ message: 'Los apellidos deben ser una cadena de texto' })
  @MaxLength(100, { message: 'Los apellidos no pueden superar los 100 caracteres' })
  apellidos: string;

  @Field()
  @IsNotEmpty({ message: 'El email es requerido' })
  @IsEmail({}, { message: 'El email debe tener un formato válido' })
  email: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El teléfono debe ser una cadena de texto' })
  telefono?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La especialidad debe ser una cadena de texto' })
  especialidad?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La descripción debe ser una cadena de texto' })
  descripcion?: string;

  @Field()
  @IsNotEmpty({ message: 'El Google Calendar ID es requerido' })
  @IsString({ message: 'El Google Calendar ID debe ser una cadena de texto' })
  googleCalendarId: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'La ruta del Service Account debe ser una cadena de texto' })
  serviceAccountKeyPath?: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString({ message: 'El color del calendario debe ser una cadena de texto' })
  colorCalendario?: string;
} 