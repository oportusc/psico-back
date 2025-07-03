import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Consulta } from '../consultas/consulta.entity';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private transporter;

  constructor(private configService: ConfigService) {
    this.initializeEmailTransporter();
  }

  private initializeEmailTransporter() {
    // Configuración para Gmail (puedes cambiar por otro proveedor)
    this.transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: this.configService.get('EMAIL_USER'),
        pass: this.configService.get('EMAIL_PASSWORD'), // App Password de Gmail
      },
    });

    this.logger.log('Servicio de email inicializado');
  }

  async sendConsultationConfirmation(consulta: Consulta): Promise<boolean> {
    try {
      const isOnline = consulta.tipo === 'online';
      const meetSection = consulta.googleMeetLink 
        ? this.generateMeetSection(consulta.googleMeetLink)
        : '';

      const calendarLinks = this.generateCalendarLinks(consulta);

      const htmlContent = this.generateEmailTemplate({
        pacienteNombre: `${consulta.usuario.nombre} ${consulta.usuario.apellidos}`,
        fecha: this.formatDate(consulta.fecha),
        hora: consulta.hora,
        tipo: consulta.tipo.toUpperCase(),
        motivo: consulta.motivo,
        isOnline,
        meetSection,
        calendarLinks,
        consultaId: consulta.id,
        psicologoNombre: `${consulta.psicologo.nombre} ${consulta.psicologo.apellidos}`,
        psicologoEmail: consulta.psicologo.email,
        psicologoEspecialidad: consulta.psicologo.especialidad || 'Psicología Clínica'
      });

      const mailOptions = {
        from: this.configService.get('EMAIL_USER'),
        to: consulta.usuario.correo,
        subject: `✅ Confirmación de Consulta Psicológica - ${this.formatDate(consulta.fecha)}`,
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Email de confirmación enviado a: ${consulta.usuario.correo}`);
      return true;
    } catch (error) {
      this.logger.error('Error enviando email de confirmación:', error);
      return false;
    }
  }

  private generateMeetSection(meetLink: string): string {
    return `
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1976d2; margin: 0 0 15px 0;">🎥 Reunión Online</h3>
        <p style="margin: 10px 0;">Su consulta será realizada por videoconferencia:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${meetLink}" 
             style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            📹 Unirse a Google Meet
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          <strong>Importante:</strong> Asegúrese de probar su cámara y micrófono antes de la consulta.
        </p>
      </div>
    `;
  }

  private generateCalendarLinks(consulta: Consulta): string {
    const startDate = new Date(consulta.fecha);
    const [hours, minutes] = consulta.hora.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 50);

    // Formato para URLs de calendario
    const formatForCalendar = (date: Date) => 
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const start = formatForCalendar(startDate);
    const end = formatForCalendar(endDate);
    
    const title = encodeURIComponent(`Consulta Psicológica${consulta.tipo === 'online' ? ' (Online)' : ''}`);
    const description = encodeURIComponent(`Motivo: ${consulta.motivo}${consulta.googleMeetLink ? `\n\nEnlace de reunión: ${consulta.googleMeetLink}` : ''}`);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}`;
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${start}&enddt=${end}&body=${description}`;

    return `
      <div style="margin: 20px 0;">
        <h4 style="color: #333; margin-bottom: 10px;">📅 Agregar a su calendario:</h4>
        <div style="text-align: center;">
          <a href="${googleCalendarUrl}" target="_blank" 
             style="background-color: #4285f4; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin: 5px; display: inline-block;">
            Google Calendar
          </a>
          <a href="${outlookUrl}" target="_blank"
             style="background-color: #0078d4; color: white; padding: 8px 16px; text-decoration: none; border-radius: 4px; margin: 5px; display: inline-block;">
            Outlook
          </a>
        </div>
      </div>
    `;
  }

  private formatDate(fecha: Date): string {
    return new Date(fecha).toLocaleDateString('es-CL', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private generateEmailTemplate(data: {
    pacienteNombre: string;
    fecha: string;
    hora: string;
    tipo: string;
    motivo: string;
    isOnline: boolean;
    meetSection: string;
    calendarLinks: string;
    consultaId: string;
    psicologoNombre: string;
    psicologoEmail: string;
    psicologoEspecialidad: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación de Consulta</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
    <h1 style="color: #2c3e50; margin: 0;">📅 Consulta Confirmada</h1>
    <p style="color: #7f8c8d; margin: 10px 0 0 0;">Su cita psicológica ha sido programada exitosamente</p>
  </div>

  <div style="background-color: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <h2 style="color: #2c3e50; margin-top: 0;">Estimado/a ${data.pacienteNombre},</h2>
    
    <p>Su consulta psicológica ha sido confirmada con los siguientes detalles:</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">📅 Fecha:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.fecha}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">🕐 Hora:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.hora} - ${this.addMinutes(data.hora, 50)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">📍 Modalidad:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.tipo}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">📝 Motivo:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.motivo}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">👨‍⚕️ Psicólogo/a:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.psicologoNombre}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">🎓 Especialidad:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.psicologoEspecialidad}</td>
        </tr>
      </table>
    </div>

    ${data.meetSection}

    ${data.calendarLinks}
  </div>

  <div style="background-color: #e8f5e8; border: 1px solid #d4edda; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
    <h3 style="color: #155724; margin-top: 0;">📋 Instrucciones importantes:</h3>
    <ul style="color: #155724; margin: 0; padding-left: 20px;">
      ${data.isOnline ? 
        '<li>Conéctese 5 minutos antes de la hora programada</li><li>Asegúrese de tener una conexión estable a internet</li><li>Pruebe su cámara y micrófono previamente</li>' : 
        '<li>Llegue 10 minutos antes de la cita</li><li>Traiga un documento de identidad</li><li>Si necesita cancelar, avise con al menos 24 horas de anticipación</li>'
      }
    </ul>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <div style="margin-bottom: 15px;">
      <a href="mailto:${data.psicologoEmail}?subject=Consulta%20${data.consultaId}%20-%20Confirmación" 
         style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; display: inline-block;">
        ✅ Confirmar Asistencia
      </a>
    </div>
    <div>
      <a href="mailto:${data.psicologoEmail}?subject=Consulta%20${data.consultaId}%20-%20Cancelación" 
         style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; display: inline-block;">
        ❌ Cancelar Consulta
      </a>
    </div>
  </div>

  <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">

  <div style="text-align: center; color: #6c757d; font-size: 14px;">
    <p><strong>${data.psicologoNombre}</strong></p>
    <p><em>${data.psicologoEspecialidad}</em></p>
    <p>📧 Email: ${data.psicologoEmail}</p>
    <p style="font-size: 12px; margin-top: 20px;">
      Este es un mensaje automático, por favor responda directamente al email del psicólogo.
    </p>
  </div>

</body>
</html>
    `;
  }

  private addMinutes(timeString: string, minutes: number): string {
    const [hours, mins] = timeString.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, mins + minutes, 0, 0);
    return date.toTimeString().slice(0, 5);
  }
} 