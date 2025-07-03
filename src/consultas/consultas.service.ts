import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, MoreThan, Not } from 'typeorm';
import { Consulta, TipoConsulta } from './consulta.entity';
import { CreateConsultaInput } from './dto/create-consulta.input';
import { UpdateConsultaInput } from './dto/update-consulta.input';
import { UsuariosService } from '../usuarios/usuarios.service';
import { GoogleCalendarService } from '../calendar/google-calendar.service';
import { EmailService } from '../calendar/email.service';
import { PsicologosService } from '../psicologos/psicologos.service';

@Injectable()
export class ConsultasService {
  constructor(
    @InjectRepository(Consulta)
    private consultasRepository: Repository<Consulta>,
    private usuariosService: UsuariosService,
    private googleCalendarService: GoogleCalendarService,
    private emailService: EmailService,
    private psicologosService: PsicologosService,
  ) {}

  async create(createConsultaInput: CreateConsultaInput): Promise<Consulta> {
    // Verificar que el usuario existe
    const usuario = await this.usuariosService.findOne(createConsultaInput.usuarioId);
    
    // Verificar que el psicólogo existe
    const psicologo = await this.psicologosService.findOne(createConsultaInput.psicologoId);

    // Verificar que la fecha no sea en el pasado
    const fechaConsulta = new Date(createConsultaInput.fecha);
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Ajustar la fecha de la consulta para comparación
    const fechaComparacion = new Date(fechaConsulta);
    fechaComparacion.setHours(0, 0, 0, 0);

    if (fechaComparacion < hoy) {
      throw new BadRequestException('No se pueden crear consultas en fechas pasadas');
    }

    // Verificar que no haya otra consulta en la misma fecha y hora para el mismo psicólogo
    // Crear una fecha con solo año, mes y día para la comparación
    const fechaSoloFecha = new Date(fechaConsulta.getFullYear(), fechaConsulta.getMonth(), fechaConsulta.getDate());
    
    const consultaExistente = await this.consultasRepository.findOne({
      where: {
        fecha: fechaSoloFecha,
        hora: createConsultaInput.hora,
        psicologoId: createConsultaInput.psicologoId,
        cancelada: false
      }
    });

    if (consultaExistente) {
      throw new BadRequestException(`Ya existe una consulta programada para ${psicologo.nombre} ${psicologo.apellidos} en esta fecha y hora`);
    }

    // Crear consulta en la base de datos
    const consulta = this.consultasRepository.create({
      ...createConsultaInput,
      fecha: fechaSoloFecha
    });

    const consultaGuardada = await this.consultasRepository.save(consulta);

    // Crear evento en Google Calendar
    try {
      const startDateTime = this.combineDateTime(fechaSoloFecha, createConsultaInput.hora);
      const endDateTime = this.combineDateTime(fechaSoloFecha, createConsultaInput.hora, 50); // 50 minutos
      const isOnline = createConsultaInput.tipo === 'online';

      const calendarResult = await this.googleCalendarService.createEvent({
        summary: `Consulta ${createConsultaInput.tipo.toUpperCase()} - ${usuario.nombre} ${usuario.apellidos}`,
        description: `Motivo: ${createConsultaInput.motivo}\nPaciente: ${usuario.nombre} ${usuario.apellidos}\nCorreo: ${usuario.correo}\nTeléfono: ${usuario.telefono}\nPsicólogo: ${psicologo.nombre} ${psicologo.apellidos}`,
        startDateTime,
        endDateTime,
        attendeeEmail: usuario.correo,
        includeGoogleMeet: isOnline,
        calendarId: psicologo.googleCalendarId,
      });

      // Actualizar consulta con el Google Event ID y Meet Link
      if (calendarResult.eventId) {
        consultaGuardada.googleEventId = calendarResult.eventId;
        if (calendarResult.meetLink) {
          consultaGuardada.googleMeetLink = calendarResult.meetLink;
        }
        await this.consultasRepository.save(consultaGuardada);
      }
    } catch (error) {
      // Log del error pero no fallar la creación de la consulta
      console.error('Error creando evento en Google Calendar:', error);
    }

    // Retornar la consulta con las relaciones usuario y psicólogo cargadas
    const consultaCompleta = await this.consultasRepository.findOne({
      where: { id: consultaGuardada.id },
      relations: ['usuario', 'psicologo']
    });

    if (!consultaCompleta) {
      throw new Error('Error cargando la consulta creada');
    }

    // Enviar email de confirmación al paciente
    try {
      await this.emailService.sendConsultationConfirmation(consultaCompleta);
    } catch (error) {
      console.error('Error enviando email de confirmación:', error);
      // No fallar la creación de la consulta por errores de email
    }

    return consultaCompleta;
  }

  private combineDateTime(date: Date, time: string, addMinutes: number = 0): string {
    const [hours, minutes] = time.split(':').map(Number);
    const dateTime = new Date(date);
    dateTime.setHours(hours, minutes + addMinutes, 0, 0);
    return dateTime.toISOString();
  }

  async findAll(): Promise<Consulta[]> {
    return this.consultasRepository.find({
      relations: ['usuario', 'psicologo'],
      order: { fecha: 'ASC', hora: 'ASC' }
    });
  }

  async findOne(id: string): Promise<Consulta> {
    const consulta = await this.consultasRepository.findOne({
      where: { id },
      relations: ['usuario', 'psicologo']
    });

    if (!consulta) {
      throw new NotFoundException(`Consulta con ID ${id} no encontrada`);
    }

    return consulta;
  }

  async findByUsuario(usuarioId: string): Promise<Consulta[]> {
    return this.consultasRepository.find({
      where: { usuarioId },
      relations: ['usuario', 'psicologo'],
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
      relations: ['usuario', 'psicologo'],
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
      relations: ['usuario', 'psicologo'],
      order: { fecha: 'DESC', hora: 'DESC' }
    });
  }

  async findByPsicologo(psicologoId: string): Promise<Consulta[]> {
    return this.consultasRepository.find({
      where: { psicologoId },
      relations: ['usuario', 'psicologo'],
      order: { fecha: 'ASC', hora: 'ASC' }
    });
  }

  async findProximasByPsicologo(psicologoId: string): Promise<Consulta[]> {
    const hoy = new Date();
    return this.consultasRepository.find({
      where: {
        psicologoId,
        fecha: MoreThan(hoy),
        cancelada: false
      },
      relations: ['usuario', 'psicologo'],
      order: { fecha: 'ASC', hora: 'ASC' }
    });
  }

  async update(id: string, updateConsultaInput: UpdateConsultaInput): Promise<Consulta> {
    const consulta = await this.findOne(id);

    // Si se está actualizando la fecha o hora, verificar conflictos
    if (updateConsultaInput.fecha || updateConsultaInput.hora) {
      const fechaConsulta = updateConsultaInput.fecha ? new Date(updateConsultaInput.fecha) : consulta.fecha;
      const hora = updateConsultaInput.hora || consulta.hora;
      
      // Normalizar la fecha para comparación
      const fechaSoloFecha = new Date(fechaConsulta.getFullYear(), fechaConsulta.getMonth(), fechaConsulta.getDate());

      const consultaExistente = await this.consultasRepository.findOne({
        where: {
          fecha: fechaSoloFecha,
          hora: hora,
          cancelada: false,
          id: Not(id)
        }
      });

      if (consultaExistente) {
        throw new BadRequestException('Ya existe una consulta programada para esta fecha y hora');
      }
    }

    // Si se está actualizando la fecha, normalizarla
    if (updateConsultaInput.fecha) {
      const nuevaFecha = new Date(updateConsultaInput.fecha);
      const fechaNormalizada = new Date(nuevaFecha.getFullYear(), nuevaFecha.getMonth(), nuevaFecha.getDate());
      updateConsultaInput.fecha = fechaNormalizada.toISOString();
    }
    
    Object.assign(consulta, updateConsultaInput);
    const consultaActualizada = await this.consultasRepository.save(consulta);

    // Actualizar evento en Google Calendar si existe
    if (consulta.googleEventId) {
      try {
        const fechaFinal = updateConsultaInput.fecha ? new Date(updateConsultaInput.fecha) : consulta.fecha;
        const horaFinal = updateConsultaInput.hora || consulta.hora;
        const tipoFinal = (updateConsultaInput.tipo || consulta.tipo) as any;
        const motivoFinal = updateConsultaInput.motivo || consulta.motivo;
        
        // Normalizar la fecha para Google Calendar
        const fechaNormalizada = new Date(fechaFinal.getFullYear(), fechaFinal.getMonth(), fechaFinal.getDate());
        
        const startDateTime = this.combineDateTime(fechaNormalizada, horaFinal);
        const endDateTime = this.combineDateTime(fechaNormalizada, horaFinal, 50);
        const isOnline = tipoFinal === 'online';

        const updateResult = await this.googleCalendarService.updateEvent(consulta.googleEventId, {
          summary: `Consulta ${tipoFinal.toUpperCase()} - ${consulta.usuario.nombre} ${consulta.usuario.apellidos}`,
          description: `Motivo: ${motivoFinal}\nPaciente: ${consulta.usuario.nombre} ${consulta.usuario.apellidos}\nCorreo: ${consulta.usuario.correo}`,
          startDateTime,
          endDateTime,
          attendeeEmail: consulta.usuario.correo,
          includeGoogleMeet: isOnline,
        });

        // Actualizar Meet Link si cambió a online
        if (updateResult.success && updateResult.meetLink) {
          consultaActualizada.googleMeetLink = updateResult.meetLink;
          await this.consultasRepository.save(consultaActualizada);
        }
      } catch (error) {
        console.error('Error actualizando evento en Google Calendar:', error);
      }
    }

    // Retornar la consulta con la relación usuario cargada
    const consultaConUsuario = await this.consultasRepository.findOne({
      where: { id: consultaActualizada.id },
      relations: ['usuario']
    });

    if (!consultaConUsuario) {
      throw new Error('Error cargando la consulta actualizada');
    }

    return consultaConUsuario;
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
    
    // Eliminar evento de Google Calendar si existe
    if (consulta.googleEventId) {
      try {
        await this.googleCalendarService.deleteEvent(consulta.googleEventId);
      } catch (error) {
        console.error('Error eliminando evento de Google Calendar:', error);
      }
    }
    
    await this.consultasRepository.remove(consulta);
    return consulta;
  }

  // Nuevo método para obtener horarios disponibles
  async getAvailableSlots(date: string, workingHours: { start: string; end: string }): Promise<string[]> {
    const fechaConsulta = new Date(date);
    
    // Verificar que la fecha no sea en el pasado
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    // Normalizar la fecha de la consulta para comparación
    const fechaNormalizada = new Date(fechaConsulta.getFullYear(), fechaConsulta.getMonth(), fechaConsulta.getDate());
    
    if (fechaNormalizada < hoy) {
      return [];
    }
    
    return this.googleCalendarService.getAvailableSlots(fechaNormalizada, workingHours);
  }
} 