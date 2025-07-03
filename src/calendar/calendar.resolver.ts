import { Resolver, Query, Mutation, Args, ObjectType, Field } from '@nestjs/graphql';
import { GoogleCalendarService } from './google-calendar.service';

@ObjectType()
class CreateEventResponse {
  @Field()
  eventId: string;
  
  @Field({ nullable: true })
  meetLink?: string;
  
  @Field()
  success: boolean;
  
  @Field({ nullable: true })
  message?: string;
}

@Resolver()
export class CalendarResolver {
  constructor(private readonly googleCalendarService: GoogleCalendarService) {}

  @Query(() => Boolean, { name: 'testCalendarConnection' })
  async testCalendarConnection(): Promise<boolean> {
    return this.googleCalendarService.testConnection();
  }

  @Mutation(() => CreateEventResponse, { name: 'createTestEvent' })
  async createTestEvent(
    @Args('summary') summary: string,
    @Args('description') description: string,
    @Args('startDateTime') startDateTime: string,
    @Args('endDateTime') endDateTime: string,
    @Args('includeGoogleMeet', { defaultValue: false }) includeGoogleMeet: boolean,
  ): Promise<CreateEventResponse> {
    const result = await this.googleCalendarService.createEvent({
      summary,
      description,
      startDateTime,
      endDateTime,
      includeGoogleMeet,
    });
    
    if (result.eventId) {
      return {
        eventId: result.eventId,
        meetLink: result.meetLink,
        success: true,
        message: 'Evento creado exitosamente'
      };
    } else {
      return {
        eventId: '',
        success: false,
        message: 'Error creando evento'
      };
    }
  }

  @Query(() => [String], { name: 'getEventsForDate' })
  async getEventsForDate(
    @Args('date') date: string,
  ): Promise<string[]> {
    const events = await this.googleCalendarService.getEventsForDate(new Date(date));
    return events.map(event => `${event.summary} - ${event.start?.dateTime || event.start?.date}`);
  }
} 