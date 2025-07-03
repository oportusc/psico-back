import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { ConsultasService } from './consultas.service';
import { Consulta, TipoConsulta } from './consulta.entity';
import { CreateConsultaInput } from './dto/create-consulta.input';
import { UpdateConsultaInput } from './dto/update-consulta.input';

@Resolver(() => Consulta)
export class ConsultasResolver {
  constructor(private readonly consultasService: ConsultasService) {}

  @Mutation(() => Consulta)
  createConsulta(@Args('createConsultaInput') createConsultaInput: CreateConsultaInput) {
    return this.consultasService.create(createConsultaInput);
  }

  @Query(() => [Consulta], { name: 'consultas' })
  findAll() {
    return this.consultasService.findAll();
  }

  @Query(() => Consulta, { name: 'consulta' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.consultasService.findOne(id);
  }

  @Query(() => [Consulta], { name: 'consultasByUsuario' })
  findByUsuario(@Args('usuarioId', { type: () => String }) usuarioId: string) {
    return this.consultasService.findByUsuario(usuarioId);
  }

  @Query(() => [Consulta], { name: 'consultasProximas' })
  findProximas() {
    return this.consultasService.findProximas();
  }

  @Query(() => [Consulta], { name: 'consultasPasadas' })
  findPasadas() {
    return this.consultasService.findPasadas();
  }

  @Query(() => [Consulta], { name: 'consultasByPsicologo' })
  findByPsicologo(@Args('psicologoId', { type: () => String }) psicologoId: string) {
    return this.consultasService.findByPsicologo(psicologoId);
  }

  @Query(() => [Consulta], { name: 'consultasProximasByPsicologo' })
  findProximasByPsicologo(@Args('psicologoId', { type: () => String }) psicologoId: string) {
    return this.consultasService.findProximasByPsicologo(psicologoId);
  }

  @Mutation(() => Consulta)
  updateConsulta(
    @Args('id', { type: () => String }) id: string,
    @Args('updateConsultaInput') updateConsultaInput: UpdateConsultaInput,
  ) {
    return this.consultasService.update(id, updateConsultaInput);
  }

  @Mutation(() => Consulta)
  confirmarConsulta(@Args('id', { type: () => String }) id: string) {
    return this.consultasService.confirmar(id);
  }

  @Mutation(() => Consulta)
  cancelarConsulta(@Args('id', { type: () => String }) id: string) {
    return this.consultasService.cancelar(id);
  }

  @Mutation(() => Consulta)
  removeConsulta(@Args('id', { type: () => String }) id: string) {
    return this.consultasService.remove(id);
  }

  @Query(() => [String], { name: 'horariosDisponibles' })
  getAvailableSlots(
    @Args('fecha', { type: () => String }) fecha: string,
    @Args('horaInicio', { type: () => String, defaultValue: '09:00' }) horaInicio: string,
    @Args('horaFin', { type: () => String, defaultValue: '18:00' }) horaFin: string,
  ): Promise<string[]> {
    return this.consultasService.getAvailableSlots(fecha, { 
      start: horaInicio, 
      end: horaFin 
    });
  }
} 