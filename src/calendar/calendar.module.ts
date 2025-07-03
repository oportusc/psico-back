import { Module } from '@nestjs/common';
import { GoogleCalendarService } from './google-calendar.service';
import { CalendarResolver } from './calendar.resolver';
import { EmailService } from './email.service';

@Module({
  providers: [GoogleCalendarService, CalendarResolver, EmailService],
  exports: [GoogleCalendarService, EmailService],
})
export class CalendarModule {} 