import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Consulta, TipoConsulta } from './consulta.entity';
import { CreateConsultaInput } from './dto/create-consulta.input';
import { UpdateConsultaInput } from './dto/update-consulta.input';
import { UsuariosService } from '../usuarios/usuarios.service';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectRepository(Consulta)
    private consultasRepository: Repository<Consulta>,
    private usuariosService: UsuariosService,
  ) {}

  async create(createConsultaInput: CreateConsultaInput): Promise<Consulta> {
    // Verificar que el usuario existe
    await this.usuariosService.findOne(createConsultaInput.usuarioId);

    // Verificar que la fecha no sea en el pasado
    const fechaConsulta = new Date(createConsultaInput.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    if (fechaConsulta < hoy) {
      throw new BadRequestException('No se pueden crear consultas en fechas pasadas');
    }

    // Verificar que no haya otra consulta en la misma fecha y hora
    const consultaExistente = await this.consultasRepository.findOne({
      where: {
        fecha: fechaConsulta,
        hora: createConsultaInput.hora,
        cancelada: false
      }
    });

    if (consultaExistente) {
      throw new BadRequestException('Ya existe una consulta programada para esta fecha y hora');
    }

    const consulta = this.consultasRepository.create({
      ...createConsultaInput,
      fecha: fechaConsulta
    });

    return this.consultasRepository.save(consulta);
  }

  async findAll(): Promise<Consulta[]> {
    return this.consultasRepository.find({
      relations: ['usuario'],
      order: { fecha: 'ASC', hora: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Consulta> {
    const consulta = await this.consultasRepository.findOne({
      where: { id },
      relations: ['usuario']
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }

    return consulta;
  }

  async findByUsuario(usuarioId: string): Promise<Consulta[]> {
    return this.consultasRepository.find({
      where: { usuarioId },
      relations: ['usuario'],
      order: { fecha: 'ASC', hora: 'ASC' }
    });
  }

  async findProximas(): Promise<Consulta[]> {
    const hoy = new Date();
    return this.consultasRepository.find({
      where: {
        fecha: MoreThan(hoy),
        cancelada: false
      },
      relations: ['usuario'],
      order: { fecha: 'ASC', hora: 'ASC' }
    });
  }

  async findPasadas(): Promise<Consulta[]> {
    const hoy = new Date();
    return this.consultasRepository.find({
      where: {
        fecha: LessThan(hoy),
        cancelada: false
      },
      relations: ['usuario'],
      order: { fecha: 'DESC', hora: 'DESC' }
    });
  }

  async update(id: string, updateConsultaInput: UpdateConsultaInput): Promise<Consulta> {
    const consulta = await this.findOne(id);

    // Si se está actualizando la fecha o hora, verificar conflictos
    if (updateConsultaInput.fecha || updateConsultaInput.hora) {
      const fechaConsulta = updateConsultaInput.fecha ? new Date(updateConsultaInput.fecha) : consulta.fecha;
      const hora = updateConsultaInput.hora || consulta.hora;

      const consultaExistente = await this.consultasRepository.findOne({
        where: {
          fecha: fechaConsulta,
          hora: hora,
          cancelada: false,
          id: Not(id)
        }
      });

      if (consultaExistente) {
        throw new BadRequestException('Ya existe una consulta programada para esta fecha y hora');
      }
    }

    Object.assign(consulta, updateConsultaInput);
    return this.consultasRepository.save(consulta);
  }

  async confirmar(id: string): Promise<Consulta> {
    const consulta = await this.findOne(id);
    consulta.confirmada = true;
    return this.consultasRepository.save(consulta);
  }

  async cancelar(id: string): Promise<Consulta> {
    const consulta = await this.findOne(id);
    consulta.cancelada = true;
    return this.consultasRepository.save(consulta);
  }

  async remove(id: string): Promise<Consulta> {
    const consulta = await this.findOne(id);
    await this.consultasRepository.remove(consulta);
    return consulta;
  }
} 