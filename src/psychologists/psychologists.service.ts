import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Psychologist } from './psychologist.entity';
import { CreatePsychologistInput } from './dto/create-psychologist.input';
import { UpdatePsychologistInput } from './dto/update-psychologist.input';

@Injectable()
export class PsychologistsService {
  constructor(
    @InjectModel(Psychologist.name) private psychologistModel: Model<Psychologist>,
  ) {}

  async create(createPsychologistInput: CreatePsychologistInput): Promise<Psychologist> {
    // Check if a psychologist with that email already exists
    const existingPsychologist = await this.psychologistModel.findOne({
      email: createPsychologistInput.email
    });

    if (existingPsychologist) {
      throw new ConflictException('A psychologist with that email already exists');
    }

    // Check if a psychologist with that Google Calendar ID already exists
    const existingCalendar = await this.psychologistModel.findOne({
      googleCalendarId: createPsychologistInput.googleCalendarId
    });

    if (existingCalendar) {
      throw new ConflictException('A psychologist with that Google Calendar ID already exists');
    }

    const psychologist = new this.psychologistModel(createPsychologistInput);
    return await psychologist.save();
  }

  async findAll(): Promise<Psychologist[]> {
    return await this.psychologistModel.find({
      active: true
    }).sort({ firstName: 1 }).exec();
  }

  async findAllIncludingInactive(): Promise<Psychologist[]> {
    return await this.psychologistModel.find()
      .sort({ firstName: 1 })
      .exec();
  }

  async findOne(id: string): Promise<Psychologist> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Psychologist with ID "${id}" not found`);
    }

    const psychologist = await this.psychologistModel.findById(id)
      .populate('appointments')
      .exec();

    if (!psychologist) {
      throw new NotFoundException(`Psychologist with ID "${id}" not found`);
    }

    return psychologist;
  }

  async findByEmail(email: string): Promise<Psychologist> {
    const psychologist = await this.psychologistModel.findOne({ email });

    if (!psychologist) {
      throw new NotFoundException(`Psychologist with email "${email}" not found`);
    }

    return psychologist;
  }

  async findByGoogleCalendarId(googleCalendarId: string): Promise<Psychologist> {
    const psychologist = await this.psychologistModel.findOne({ googleCalendarId });

    if (!psychologist) {
      throw new NotFoundException(`Psychologist with Google Calendar ID "${googleCalendarId}" not found`);
    }

    return psychologist;
  }

  async update(id: string, updatePsychologistInput: UpdatePsychologistInput): Promise<Psychologist> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`Psychologist with ID "${id}" not found`);
    }

    const psychologist = await this.findOne(id);

    // Check unique email if changing
    if (updatePsychologistInput.email && updatePsychologistInput.email !== psychologist.email) {
      const existingPsychologist = await this.psychologistModel.findOne({
        email: updatePsychologistInput.email
      });

      if (existingPsychologist) {
        throw new ConflictException('A psychologist with that email already exists');
      }
    }

    // Check unique Google Calendar ID if changing
    if (updatePsychologistInput.googleCalendarId && updatePsychologistInput.googleCalendarId !== psychologist.googleCalendarId) {
      const existingCalendar = await this.psychologistModel.findOne({
        googleCalendarId: updatePsychologistInput.googleCalendarId
      });

      if (existingCalendar) {
        throw new ConflictException('A psychologist with that Google Calendar ID already exists');
      }
    }

    // Update fields
    const updatedPsychologist = await this.psychologistModel.findByIdAndUpdate(
      id,
      updatePsychologistInput,
      { new: true }
    ).populate('appointments').exec();

    if (!updatedPsychologist) {
      throw new NotFoundException(`Psychologist with ID "${id}" not found`);
    }

    return updatedPsychologist;
  }

  async remove(id: string): Promise<Psychologist> {
    const psychologist = await this.findOne(id);
    
    // Mark as inactive instead of deleting
    psychologist.active = false;
    return await psychologist.save();
  }

  async activate(id: string): Promise<Psychologist> {
    const psychologist = await this.findOne(id);
    psychologist.active = true;
    return await psychologist.save();
  }

  async countAppointments(psychologistId: string): Promise<number> {
    const psychologist = await this.psychologistModel.findById(psychologistId)
      .populate('appointments')
      .exec();

    if (!psychologist) {
      throw new NotFoundException(`Psychologist with ID "${psychologistId}" not found`);
    }

    return psychologist.appointments ? psychologist.appointments.length : 0;
  }

  async findAppointments(psychologistId: string): Promise<any[]> {
    const psychologist = await this.psychologistModel.findById(psychologistId).populate('appointments');
    return psychologist?.appointments || [];
  }
} 