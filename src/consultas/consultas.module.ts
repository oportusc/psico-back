import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConsultasService } from './consultas.service';
import { ConsultasResolver } from './consultas.resolver';
import { Consulta } from './consulta.entity';
import { UsuariosModule } from '../usuarios/usuarios.module';

@Module({
  imports: [TypeOrmModule.forFeature([Consulta]), UsuariosModule],
  providers: [ConsultasResolver, ConsultasService],
  exports: [ConsultasService],
})
export class ConsultasModule {} 