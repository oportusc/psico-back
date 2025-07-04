import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppointmentsService } from './appointments.service';
import { AppointmentsResolver } from './appointments.resolver';
import { Appointment, AppointmentSchema } from './appointment.entity';
import { UsersModule } from '../users/users.module';
import { PsychologistsModule } from '../psychologists/psychologists.module';
import { CalendarModule } from '../calendar/calendar.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Appointment.name, schema: AppointmentSchema }]),
    UsersModule,
    PsychologistsModule,
    CalendarModule,
  ],
  providers: [AppointmentsResolver, AppointmentsService],
  exports: [AppointmentsService],
})
export class AppointmentsModule {} 