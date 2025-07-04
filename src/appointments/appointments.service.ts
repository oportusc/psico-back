import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Appointment, AppointmentType } from './appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';
import { UsersService } from '../users/users.service';
import { GoogleCalendarService } from '../calendar/google-calendar.service';
import { EmailService } from '../calendar/email.service';
import { PsychologistsService } from '../psychologists/psychologists.service';

@Injectable()
export class AppointmentsService {
  constructor(
    @InjectModel(Appointment.name) private appointmentModel: Model<Appointment>,
    private usersService: UsersService,
    private googleCalendarService: GoogleCalendarService,
    private emailService: EmailService,
    private psychologistsService: PsychologistsService,
  ) {}

  async create(createAppointmentInput: CreateAppointmentInput): Promise<Appointment> {
    // Verify that the user exists
    const user = await this.usersService.findOne(createAppointmentInput.userId);
    
    // Verify that the psychologist exists
    const psychologist = await this.psychologistsService.findOne(createAppointmentInput.psychologistId);

    // Verify that the date is not in the past
    const appointmentDate = new Date(createAppointmentInput.date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Adjust the appointment date for comparison
    const dateComparison = new Date(appointmentDate);
    dateComparison.setHours(0, 0, 0, 0);

    if (dateComparison < today) {
      throw new BadRequestException('Cannot create appointments on past dates');
    }

    // Verify that there is no other appointment at the same date and time for the same psychologist
    const dateOnly = new Date(appointmentDate.getFullYear(), appointmentDate.getMonth(), appointmentDate.getDate());
    
    const existingAppointment = await this.appointmentModel.findOne({
      date: dateOnly,
      time: createAppointmentInput.time,
      psychologistId: new Types.ObjectId(createAppointmentInput.psychologistId),
      cancelled: false
    });

    if (existingAppointment) {
      throw new BadRequestException(`An appointment already exists for ${psychologist.firstName} ${psychologist.lastName} at this date and time`);
    }

    // Create appointment in the database
    const appointment = new this.appointmentModel({
      ...createAppointmentInput,
      userId: new Types.ObjectId(createAppointmentInput.userId),
      psychologistId: new Types.ObjectId(createAppointmentInput.psychologistId),
      date: dateOnly
    });

    const savedAppointment = await appointment.save();

    // Create event in Google Calendar
    try {
      const startDateTime = this.combineDateTime(dateOnly, createAppointmentInput.time);
      const endDateTime = this.combineDateTime(dateOnly, createAppointmentInput.time, 50); // 50 minutes
      const isOnline = createAppointmentInput.type === AppointmentType.ONLINE;

      const calendarResult = await this.googleCalendarService.createEvent({
        summary: `${createAppointmentInput.type.toUpperCase()} Appointment - ${user.firstName} ${user.lastName}`,
        description: `Reason: ${createAppointmentInput.reason}\nPatient: ${user.firstName} ${user.lastName}\nEmail: ${user.email}\nPhone: ${user.phone}\nPsychologist: ${psychologist.firstName} ${psychologist.lastName}`,
        startDateTime,
        endDateTime,
        attendeeEmail: user.email,
        includeGoogleMeet: isOnline,
        calendarId: psychologist.googleCalendarId,
      });

      // Update appointment with Google Event ID and Meet Link
      if (calendarResult.eventId) {
        savedAppointment.googleEventId = calendarResult.eventId;
        if (calendarResult.meetLink) {
          savedAppointment.googleMeetLink = calendarResult.meetLink;
        }
        await savedAppointment.save();
      }
    } catch (error) {
      // Log error but don't fail appointment creation
      console.error('Error creating Google Calendar event:', error);
    }

    // Return the appointment with user and psychologist relations loaded
    const completeAppointment = await this.appointmentModel.findById(savedAppointment.id)
      .populate('user')
      .populate('psychologist')
      .exec();

    if (!completeAppointment) {
      throw new Error('Error loading created appointment');
    }

    // Send confirmation email to patient
    try {
      await this.emailService.sendAppointmentConfirmation(completeAppointment);
    } catch (error) {
      console.error('Error sending confirmation email:', error);
      // Don't fail appointment creation due to email errors
    }

    return completeAppointment;
  }

  private combineDateTime(date: Date, time: string, addMinutes: number = 0): string {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes + addMinutes, 0, 0);
    return dateTime.toISOString();
  }

  async findAll(): Promise<Appointment[]> {
    return this.appointmentModel.find()
      .populate('user')
      .populate('psychologist')
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const appointment = await this.appointmentModel.findById(id)
      .populate('user')
      .populate('psychologist')
      .exec();

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async findByUser(userId: string): Promise<Appointment[]> {
    if (!Types.ObjectId.isValid(userId)) {
      throw new NotFoundException(`Invalid user ID ${userId}`);
    }

    return this.appointmentModel.find({ userId: new Types.ObjectId(userId) })
      .populate('user')
      .populate('psychologist')
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async findUpcoming(): Promise<Appointment[]> {
    const today = new Date();
    return this.appointmentModel.find({
      date: { $gt: today },
      cancelled: false
    })
      .populate('user')
      .populate('psychologist')
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async findPast(): Promise<Appointment[]> {
    const today = new Date();
    return this.appointmentModel.find({
      date: { $lt: today },
      cancelled: false
    })
      .populate('user')
      .populate('psychologist')
      .sort({ date: -1, time: -1 })
      .exec();
  }

  async findByPsychologist(psychologistId: string): Promise<Appointment[]> {
    if (!Types.ObjectId.isValid(psychologistId)) {
      throw new NotFoundException(`Invalid psychologist ID ${psychologistId}`);
    }

    return this.appointmentModel.find({ psychologistId: new Types.ObjectId(psychologistId) })
      .populate('user')
      .populate('psychologist')
      .sort({ date: 1, time: 1 })
      .exec();
  }

  async update(id: string, updateAppointmentInput: UpdateAppointmentInput): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const updatedAppointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      updateAppointmentInput,
      { new: true }
    )
      .populate('user')
      .populate('psychologist')
      .exec();

    if (!updatedAppointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return updatedAppointment;
  }

  async confirm(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const appointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      { confirmed: true },
      { new: true }
    )
      .populate('user')
      .populate('psychologist')
      .exec();

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async cancel(id: string): Promise<Appointment> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    const appointment = await this.appointmentModel.findByIdAndUpdate(
      id,
      { cancelled: true },
      { new: true }
    )
      .populate('user')
      .populate('psychologist')
      .exec();

    if (!appointment) {
      throw new NotFoundException(`Appointment with ID ${id} not found`);
    }

    return appointment;
  }

  async remove(id: string): Promise<Appointment> {
    const appointment = await this.findOne(id);
    await this.appointmentModel.findByIdAndDelete(id);
    return appointment;
  }
} 