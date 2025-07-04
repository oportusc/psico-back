import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';
import { Appointment, AppointmentType } from '../appointments/appointment.entity';

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

    this.logger.log('Email service initialized');
  }

  async sendAppointmentConfirmation(appointment: Appointment): Promise<boolean> {
    try {
      const isOnline = appointment.type === AppointmentType.ONLINE;
      const meetSection = appointment.googleMeetLink 
        ? this.generateMeetSection(appointment.googleMeetLink)
        : '';

      const calendarLinks = this.generateCalendarLinks(appointment);

      const htmlContent = this.generateEmailTemplate({
        patientName: appointment.user ? `${appointment.user.firstName} ${appointment.user.lastName}` : 'Patient',
        date: this.formatDate(appointment.date),
        time: appointment.time,
        type: appointment.type.toUpperCase(),
        reason: appointment.reason,
        isOnline,
        meetSection,
        calendarLinks,
        appointmentId: appointment.id,
        psychologistName: appointment.psychologist ? `${appointment.psychologist.firstName} ${appointment.psychologist.lastName}` : 'Psychologist',
        psychologistEmail: appointment.psychologist?.email || process.env.CONTACT_EMAIL || 'support@psico.com',
        psychologistSpecialty: appointment.psychologist?.specialty || 'Clinical Psychology'
      });

      const mailOptions = {
        from: this.configService.get('EMAIL_USER'),
        to: appointment.user?.email || process.env.CONTACT_EMAIL || 'support@psico.com',
        subject: `✅ Psychological Appointment Confirmation - ${this.formatDate(appointment.date)}`,
        html: htmlContent,
      };

      await this.transporter.sendMail(mailOptions);
      this.logger.log(`Confirmation email sent to: ${appointment.user?.email || 'default email'}`);
      return true;
    } catch (error) {
      this.logger.error('Error sending confirmation email:', error);
      return false;
    }
  }

  private generateMeetSection(meetLink: string): string {
    return `
      <div style="background-color: #e3f2fd; padding: 20px; border-radius: 8px; margin: 20px 0;">
        <h3 style="color: #1976d2; margin: 0 0 15px 0;">🎥 Online Meeting</h3>
        <p style="margin: 10px 0;">Your appointment will be conducted via video conference:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${meetLink}" 
             style="background-color: #4285f4; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
            📹 Join Google Meet
          </a>
        </div>
        <p style="font-size: 14px; color: #666;">
          <strong>Important:</strong> Please test your camera and microphone before the appointment.
        </p>
      </div>
    `;
  }

  private generateCalendarLinks(appointment: Appointment): string {
    const startDate = new Date(appointment.date);
    const [hours, minutes] = appointment.time.split(':');
    startDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);
    
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + 50);

    // Formato para URLs de calendario
    const formatForCalendar = (date: Date) => 
      date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';

    const start = formatForCalendar(startDate);
    const end = formatForCalendar(endDate);
    
    const title = encodeURIComponent(`Psychological Appointment${appointment.type === AppointmentType.ONLINE ? ' (Online)' : ''}`);
    const description = encodeURIComponent(`Reason: ${appointment.reason}${appointment.googleMeetLink ? `\n\nMeeting link: ${appointment.googleMeetLink}` : ''}`);

    const googleCalendarUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${start}/${end}&details=${description}`;
    const outlookUrl = `https://outlook.live.com/calendar/0/deeplink/compose?subject=${title}&startdt=${start}&enddt=${end}&body=${description}`;

    return `
      <div style="margin: 20px 0;">
        <h4 style="color: #333; margin-bottom: 10px;">📅 Add to your calendar:</h4>
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

  private formatDate(date: Date): string {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  private generateEmailTemplate(data: {
    patientName: string;
    date: string;
    time: string;
    type: string;
    reason: string;
    isOnline: boolean;
    meetSection: string;
    calendarLinks: string;
    appointmentId: string;
    psychologistName: string;
    psychologistEmail: string;
    psychologistSpecialty: string;
  }): string {
    return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Appointment Confirmation</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  
  <div style="text-align: center; background-color: #f8f9fa; padding: 30px; border-radius: 10px; margin-bottom: 30px;">
    <h1 style="color: #2c3e50; margin: 0;">📅 Appointment Confirmed</h1>
    <p style="color: #7f8c8d; margin: 10px 0 0 0;">Your psychological appointment has been successfully scheduled</p>
  </div>

  <div style="background-color: white; border: 1px solid #e9ecef; border-radius: 8px; padding: 25px; margin-bottom: 25px;">
    <h2 style="color: #2c3e50; margin-top: 0;">Dear ${data.patientName},</h2>
    
    <p>Your psychological appointment has been confirmed with the following details:</p>
    
    <div style="background-color: #f8f9fa; padding: 20px; border-radius: 6px; margin: 20px 0;">
      <table style="width: 100%; border-collapse: collapse;">
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">📅 Date:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.date}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">🕐 Time:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.time} - ${this.addMinutes(data.time, 50)}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">📍 Type:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.type}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">📝 Reason:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.reason}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">👨‍⚕️ Psychologist:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.psychologistName}</td>
        </tr>
        <tr>
          <td style="padding: 8px 0; font-weight: bold; color: #495057;">🎓 Specialty:</td>
          <td style="padding: 8px 0; color: #6c757d;">${data.psychologistSpecialty}</td>
        </tr>
      </table>
    </div>

    ${data.meetSection}

    ${data.calendarLinks}
  </div>

  <div style="background-color: #e8f5e8; border: 1px solid #d4edda; border-radius: 6px; padding: 20px; margin-bottom: 25px;">
    <h3 style="color: #155724; margin-top: 0;">📋 Important instructions:</h3>
    <ul style="color: #155724; margin: 0; padding-left: 20px;">
      ${data.isOnline ? 
        '<li>Connect 5 minutes before the scheduled time</li><li>Ensure you have a stable internet connection</li><li>Test your camera and microphone beforehand</li>' : 
        '<li>Arrive 10 minutes before the appointment</li><li>Bring an identification document</li><li>If you need to cancel, please notify at least 24 hours in advance</li>'
      }
    </ul>
  </div>

  <div style="text-align: center; margin: 30px 0;">
    <div style="margin-bottom: 15px;">
      <a href="mailto:${data.psychologistEmail}?subject=Appointment%20${data.appointmentId}%20-%20Confirmation" 
         style="background-color: #28a745; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; display: inline-block;">
        ✅ Confirm Attendance
      </a>
    </div>
    <div>
      <a href="mailto:${data.psychologistEmail}?subject=Appointment%20${data.appointmentId}%20-%20Cancellation" 
         style="background-color: #dc3545; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 5px; display: inline-block;">
        ❌ Cancel Appointment
      </a>
    </div>
  </div>

  <hr style="border: none; border-top: 1px solid #e9ecef; margin: 30px 0;">

  <div style="text-align: center; color: #6c757d; font-size: 14px;">
    <p><strong>${data.psychologistName}</strong></p>
    <p><em>${data.psychologistSpecialty}</em></p>
    <p>📧 Email: ${data.psychologistEmail}</p>
    <p style="font-size: 12px; margin-top: 20px;">
      This is an automated message, please respond directly to the psychologist's email.
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