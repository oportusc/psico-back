import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Psicologo } from './psicologo.entity';
import { CreatePsicologoInput } from './dto/create-psicologo.input';
import { UpdatePsicologoInput } from './dto/update-psicologo.input';

@Injectable()
export class PsicologosService {
  constructor(
    @InjectRepository(Psicologo)
    private psicologosRepository: Repository<Psicologo>,
  ) {}

  async create(createPsicologoInput: CreatePsicologoInput): Promise<Psicologo> {
    // Verificar si ya existe un psicólogo con ese email
    const psicologoExistente = await this.psicologosRepository.findOne({
      where: { email: createPsicologoInput.email }
    });

    if (psicologoExistente) {
      throw new ConflictException('Ya existe un psicólogo con ese email');
    }

    // Verificar si ya existe un psicólogo con ese Google Calendar ID
    const calendarioExistente = await this.psicologosRepository.findOne({
      where: { googleCalendarId: createPsicologoInput.googleCalendarId }
    });

    if (calendarioExistente) {
      throw new ConflictException('Ya existe un psicólogo con ese Google Calendar ID');
    }

    const psicologo = this.psicologosRepository.create(createPsicologoInput);
    return await this.psicologosRepository.save(psicologo);
  }

  async findAll(): Promise<Psicologo[]> {
    return await this.psicologosRepository.find({
      where: { activo: true },
      order: { nombre: 'ASC' }
    });
  }

  async findAllIncludingInactive(): Promise<Psicologo[]> {
    return await this.psicologosRepository.find({
      order: { nombre: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Psicologo> {
    const psicologo = await this.psicologosRepository.findOne({
      where: { id },
      relations: ['consultas']
    });

    if (!psicologo) {
      throw new NotFoundException(`Psicólogo con ID "${id}" no encontrado`);
    }

    return psicologo;
  }

  async findByEmail(email: string): Promise<Psicologo> {
    const psicologo = await this.psicologosRepository.findOne({
      where: { email }
    });

    if (!psicologo) {
      throw new NotFoundException(`Psicólogo con email "${email}" no encontrado`);
    }

    return psicologo;
  }

  async findByGoogleCalendarId(googleCalendarId: string): Promise<Psicologo> {
    const psicologo = await this.psicologosRepository.findOne({
      where: { googleCalendarId }
    });

    if (!psicologo) {
      throw new NotFoundException(`Psicólogo con Google Calendar ID "${googleCalendarId}" no encontrado`);
    }

    return psicologo;
  }

  async update(id: string, updatePsicologoInput: UpdatePsicologoInput): Promise<Psicologo> {
    const psicologo = await this.findOne(id);

    // Verificar email único si se está cambiando
    if (updatePsicologoInput.email && updatePsicologoInput.email !== psicologo.email) {
      const psicologoExistente = await this.psicologosRepository.findOne({
        where: { email: updatePsicologoInput.email }
      });

      if (psicologoExistente) {
        throw new ConflictException('Ya existe un psicólogo con ese email');
      }
    }

    // Verificar Google Calendar ID único si se está cambiando
    if (updatePsicologoInput.googleCalendarId && updatePsicologoInput.googleCalendarId !== psicologo.googleCalendarId) {
      const calendarioExistente = await this.psicologosRepository.findOne({
        where: { googleCalendarId: updatePsicologoInput.googleCalendarId }
      });

      if (calendarioExistente) {
        throw new ConflictException('Ya existe un psicólogo con ese Google Calendar ID');
      }
    }

    // Actualizar campos
    Object.assign(psicologo, updatePsicologoInput);
    return await this.psicologosRepository.save(psicologo);
  }

  async remove(id: string): Promise<Psicologo> {
    const psicologo = await this.findOne(id);
    
    // Marcar como inactivo en lugar de eliminar
    psicologo.activo = false;
    return await this.psicologosRepository.save(psicologo);
  }

  async activate(id: string): Promise<Psicologo> {
    const psicologo = await this.findOne(id);
    psicologo.activo = true;
    return await this.psicologosRepository.save(psicologo);
  }

  async countConsultas(psicologoId: string): Promise<number> {
    const psicologo = await this.psicologosRepository.findOne({
      where: { id: psicologoId },
      relations: ['consultas']
    });

    if (!psicologo) {
      throw new NotFoundException(`Psicólogo con ID "${psicologoId}" no encontrado`);
    }

    return psicologo.consultas ? psicologo.consultas.length : 0;
  }
} 