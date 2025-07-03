import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { google } from 'googleapis';

@Injectable()
export class GoogleCalendarService {
  private readonly logger = new Logger(GoogleCalendarService.name);
  private calendar;

  constructor(private configService: ConfigService) {
    this.initializeCalendar();
  }

  private async initializeCalendar() {
    try {
      // Configurar autenticación con Service Account
      const auth = new google.auth.GoogleAuth({
        keyFile: this.configService.get('GOOGLE_SERVICE_ACCOUNT_KEY_PATH'),
        scopes: ['https://www.googleapis.com/auth/calendar'],
      });

      this.calendar = google.calendar({ version: 'v3', auth });
      this.logger.log('Google Calendar inicializado correctamente');
    } catch (error) {
      this.logger.error('Error inicializando Google Calendar:', error);
    }
  }

  // Método de prueba para verificar que la conexión funciona
  async testConnection(): Promise<boolean> {
    try {
      const calendarId = this.configService.get('GOOGLE_CALENDAR_ID');
      
      const response = await this.calendar.calendars.get({
        calendarId: calendarId,
      });

      this.logger.log(`Conexión exitosa con calendario: ${response.data.summary}`);
      return true;
    } catch (error) {
      this.logger.error('Error probando conexión:', error);
      return false;
    }
  }

  // Crear evento en Google Calendar con Google Meet opcional
  async createEvent(eventData: {
    summary: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    attendeeEmail?: string;
    includeGoogleMeet?: boolean;
    calendarId?: string; // Opcional - si no se proporciona, usa el default
  }): Promise<{ eventId: string | null; meetLink?: string }> {
    try {
      const calendarId = eventData.calendarId || this.configService.get('GOOGLE_CALENDAR_ID');
      
      const event: any = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'America/Santiago',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'America/Santiago',
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 24 horas antes
            { method: 'popup', minutes: 30 }, // 30 minutos antes
          ],
        },
      };

      // Agregar Google Meet si es consulta online
      if (eventData.includeGoogleMeet) {
        event.conferenceData = {
          createRequest: {
            requestId: `meet-${Date.now()}`, // ID único para la reunión
          }
        };
      }

      const response = await this.calendar.events.insert({
        calendarId: calendarId,
        resource: event,
        conferenceDataVersion: eventData.includeGoogleMeet ? 1 : 0,
        sendNotifications: false,
      });

      const eventId = response.data.id;
      const meetLink = response.data.conferenceData?.entryPoints?.find(
        entry => entry.entryPointType === 'video'
      )?.uri;

      this.logger.log(`Evento creado: ${eventId}${meetLink ? ` con Google Meet: ${meetLink}` : ''}`);
      
      return {
        eventId,
        meetLink
      };
    } catch (error) {
      this.logger.error('Error creando evento:', error);
      return { eventId: null };
    }
  }

  // Actualizar evento existente
  async updateEvent(eventId: string, eventData: {
    summary: string;
    description: string;
    startDateTime: string;
    endDateTime: string;
    attendeeEmail?: string;
    includeGoogleMeet?: boolean;
    calendarId?: string; // Opcional - si no se proporciona, usa el default
  }): Promise<{ success: boolean; meetLink?: string }> {
    try {
      const calendarId = eventData.calendarId || this.configService.get('GOOGLE_CALENDAR_ID');
      
      const event: any = {
        summary: eventData.summary,
        description: eventData.description,
        start: {
          dateTime: eventData.startDateTime,
          timeZone: 'America/Santiago',
        },
        end: {
          dateTime: eventData.endDateTime,
          timeZone: 'America/Santiago',
        },
      };

      // Agregar Google Meet si es consulta online
      if (eventData.includeGoogleMeet) {
        event.conferenceData = {
          createRequest: {
            requestId: `meet-update-${Date.now()}`,
          }
        };
      }

      const response = await this.calendar.events.update({
        calendarId: calendarId,
        eventId: eventId,
        resource: event,
        conferenceDataVersion: eventData.includeGoogleMeet ? 1 : 0,
      });

      const meetLink = response.data.conferenceData?.entryPoints?.find(
        entry => entry.entryPointType === 'video'
      )?.uri;

      this.logger.log(`Evento actualizado: ${eventId}${meetLink ? ` con Google Meet: ${meetLink}` : ''}`);
      
      return {
        success: true,
        meetLink
      };
    } catch (error) {
      this.logger.error('Error actualizando evento:', error);
      return { success: false };
    }
  }

  // Eliminar evento
  async deleteEvent(eventId: string, calendarId?: string): Promise<boolean> {
    try {
      const targetCalendarId = calendarId || this.configService.get('GOOGLE_CALENDAR_ID');
      
      await this.calendar.events.delete({
        calendarId: targetCalendarId,
        eventId: eventId,
      });

      this.logger.log(`Evento eliminado: ${eventId}`);
      return true;
    } catch (error) {
      this.logger.error('Error eliminando evento:', error);
      return false;
    }
  }

  // Obtener eventos de un día específico
  async getEventsForDate(date: Date, calendarId?: string): Promise<any[]> {
    try {
      const targetCalendarId = calendarId || this.configService.get('GOOGLE_CALENDAR_ID');
      
      const startOfDay = new Date(date);
      startOfDay.setHours(0, 0, 0, 0);
      
      const endOfDay = new Date(date);
      endOfDay.setHours(23, 59, 59, 999);

      const response = await this.calendar.events.list({
        calendarId: targetCalendarId,
        timeMin: startOfDay.toISOString(),
        timeMax: endOfDay.toISOString(),
        singleEvents: true,
        orderBy: 'startTime',
      });

      return response.data.items || [];
    } catch (error) {
      this.logger.error('Error obteniendo eventos:', error);
      return [];
    }
  }

  // Obtener horarios disponibles para un día específico
  async getAvailableSlots(date: Date, workingHours: { start: string; end: string }, calendarId?: string): Promise<string[]> {
    try {
      const events = await this.getEventsForDate(date, calendarId);
      const occupiedSlots = events.map(event => {
        const startTime = new Date(event.start?.dateTime || event.start?.date);
        return startTime.toLocaleTimeString('es-CL', { 
          hour: '2-digit', 
          minute: '2-digit', 
          hour12: false 
        });
      });

      return this.generateAvailableSlots(workingHours.start, workingHours.end, occupiedSlots);
    } catch (error) {
      this.logger.error('Error obteniendo horarios disponibles:', error);
      return [];
    }
  }

  private generateAvailableSlots(startTime: string, endTime: string, occupiedSlots: string[]): string[] {
    const slots: string[] = [];
    const [startHour, startMinute] = startTime.split(':').map(Number);
    const [endHour, endMinute] = endTime.split(':').map(Number);
    
    let currentHour = startHour;
    let currentMinute = startMinute;
    
    while (currentHour < endHour || (currentHour === endHour && currentMinute < endMinute)) {
      const slot = `${currentHour.toString().padStart(2, '0')}:${currentMinute.toString().padStart(2, '0')}`;
      
      if (!occupiedSlots.includes(slot)) {
        slots.push(slot);
      }
      
      // Incrementar en 50 minutos (duración de consulta)
      currentMinute += 50;
      if (currentMinute >= 60) {
        currentHour += Math.floor(currentMinute / 60);
        currentMinute = currentMinute % 60;
      }
    }
    
    return slots;
  }
} 