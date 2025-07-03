import { InputType, Field } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsOptional, IsString, Matches } from 'class-validator';

@InputType()
export class CreateUsuarioInput {
  @Field()
  @IsNotEmpty({ message: 'El RUT es requerido' })
  @IsString()
  @Matches(/^\d{1,2}\.\d{3}\.\d{3}[-][0-9kK]{1}$/, { 
    message: 'El RUT debe tener el formato XX.XXX.XXX-X' 
  })
  rut: string;

  @Field()
  @IsNotEmpty({ message: 'El nombre es requerido' })
  @IsString()
  nombre: string;

  @Field()
  @IsNotEmpty({ message: 'Los apellidos son requeridos' })
  @IsString()
  apellidos: string;

  @Field()
  @IsEmail({}, { message: 'El correo debe tener un formato válido' })
  @IsNotEmpty({ message: 'El correo es requerido' })
  correo: string;

  @Field()
  @IsNotEmpty({ message: 'El teléfono es requerido' })
  @IsString()
  @Matches(/^\+?[1-9]\d{1,14}$/, { 
    message: 'El teléfono debe tener un formato válido' 
  })
  telefono: string;

  @Field({ nullable: true })
  @IsOptional()
  @IsString()
  direccion?: string;
} 