import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsicologosService } from './psicologos.service';
import { PsicologosResolver } from './psicologos.resolver';
import { Psicologo } from './psicologo.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Psicologo])],
  providers: [PsicologosResolver, PsicologosService],
  exports: [PsicologosService],
})
export class PsicologosModule {} 