import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PsychologistsService } from './psychologists.service';
import { PsychologistsResolver } from './psychologists.resolver';
import { Psychologist, PsychologistSchema } from './psychologist.entity';

@Module({
  imports: [MongooseModule.forFeature([{ name: Psychologist.name, schema: PsychologistSchema }])],
  providers: [PsychologistsResolver, PsychologistsService],
  exports: [PsychologistsService],
})
export class PsychologistsModule {} 