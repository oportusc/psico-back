import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psychologist } from './psychologist.entity';
import { CreatePsychologistInput } from './dto/create-psychologist.input';
import { UpdatePsychologistInput } from './dto/update-psychologist.input';

@Injectable()
export class PsychologistsService {
  constructor(
    @InjectRepository(Psychologist)
    private psychologistsRepository: Repository<Psychologist>,
  ) {}

  async create(createPsychologistInput: CreatePsychologistInput): Promise<Psychologist> {
    // Check if a psychologist with that email already exists
    const existingPsychologist = await this.psychologistsRepository.findOne({
      where: { email: createPsychologistInput.email }
    });

    if (existingPsychologist) {
      throw new ConflictException('A psychologist with that email already exists');
    }

    // Check if a psychologist with that Google Calendar ID already exists
    const existingCalendar = await this.psychologistsRepository.findOne({
      where: { googleCalendarId: createPsychologistInput.googleCalendarId }
    });

    if (existingCalendar) {
      throw new ConflictException('A psychologist with that Google Calendar ID already exists');
    }

    const psychologist = this.psychologistsRepository.create(createPsychologistInput);
    return await this.psychologistsRepository.save(psychologist);
  }

  async findAll(): Promise<Psychologist[]> {
    return await this.psychologistsRepository.find({
      where: { active: true },
      order: { firstName: 'ASC' }
    });
  }

  async findAllIncludingInactive(): Promise<Psychologist[]> {
    return await this.psychologistsRepository.find({
      order: { firstName: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Psychologist> {
    const psychologist = await this.psychologistsRepository.findOne({
      where: { id },
      relations: ['appointments']
    });

    if (!psychologist) {
      throw new NotFoundException(`Psychologist with ID "${id}" not found`);
    }

    return psychologist;
  }

  async findByEmail(email: string): Promise<Psychologist> {
    const psychologist = await this.psychologistsRepository.findOne({
      where: { email }
    });

    if (!psychologist) {
      throw new NotFoundException(`Psychologist with email "${email}" not found`);
    }

    return psychologist;
  }

  async findByGoogleCalendarId(googleCalendarId: string): Promise<Psychologist> {
    const psychologist = await this.psychologistsRepository.findOne({
      where: { googleCalendarId }
    });

    if (!psychologist) {
      throw new NotFoundException(`Psychologist with Google Calendar ID "${googleCalendarId}" not found`);
    }

    return psychologist;
  }

  async update(id: string, updatePsychologistInput: UpdatePsychologistInput): Promise<Psychologist> {
    const psychologist = await this.findOne(id);

    // Check unique email if changing
    if (updatePsychologistInput.email && updatePsychologistInput.email !== psychologist.email) {
      const existingPsychologist = await this.psychologistsRepository.findOne({
        where: { email: updatePsychologistInput.email }
      });

      if (existingPsychologist) {
        throw new ConflictException('A psychologist with that email already exists');
      }
    }

    // Check unique Google Calendar ID if changing
    if (updatePsychologistInput.googleCalendarId && updatePsychologistInput.googleCalendarId !== psychologist.googleCalendarId) {
      const existingCalendar = await this.psychologistsRepository.findOne({
        where: { googleCalendarId: updatePsychologistInput.googleCalendarId }
      });

      if (existingCalendar) {
        throw new ConflictException('A psychologist with that Google Calendar ID already exists');
      }
    }

    // Update fields
    Object.assign(psychologist, updatePsychologistInput);
    return await this.psychologistsRepository.save(psychologist);
  }

  async remove(id: string): Promise<Psychologist> {
    const psychologist = await this.findOne(id);
    
    // Mark as inactive instead of deleting
    psychologist.active = false;
    return await this.psychologistsRepository.save(psychologist);
  }

  async activate(id: string): Promise<Psychologist> {
    const psychologist = await this.findOne(id);
    psychologist.active = true;
    return await this.psychologistsRepository.save(psychologist);
  }

  async countAppointments(psychologistId: string): Promise<number> {
    const psychologist = await this.psychologistsRepository.findOne({
      where: { id: psychologistId },
      relations: ['appointments']
    });

    if (!psychologist) {
      throw new NotFoundException(`Psychologist with ID "${psychologistId}" not found`);
    }

    return psychologist.appointments ? psychologist.appointments.length : 0;
  }
} 