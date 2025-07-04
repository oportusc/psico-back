import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PsychologistsService } from './psychologists.service';
import { PsychologistsResolver } from './psychologists.resolver';
import { Psychologist } from './psychologist.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Psychologist])],
  providers: [PsychologistsResolver, PsychologistsService],
  exports: [PsychologistsService],
})
export class PsychologistsModule {} 