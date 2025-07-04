import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { AppointmentsService } from './appointments.service';
import { Appointment, AppointmentType } from './appointment.entity';
import { CreateAppointmentInput } from './dto/create-appointment.input';
import { UpdateAppointmentInput } from './dto/update-appointment.input';

@Resolver(() => Appointment)
export class AppointmentsResolver {
  constructor(private readonly appointmentsService: AppointmentsService) {}

  @Mutation(() => Appointment)
  createAppointment(@Args('createAppointmentInput') createAppointmentInput: CreateAppointmentInput) {
    return this.appointmentsService.create(createAppointmentInput);
  }

  @Query(() => [Appointment], { name: 'appointments' })
  findAll() {
    return this.appointmentsService.findAll();
  }

  @Query(() => Appointment, { name: 'appointment' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.findOne(id);
  }

  @Query(() => [Appointment], { name: 'appointmentsByUser' })
  findByUser(@Args('userId', { type: () => String }) userId: string) {
    return this.appointmentsService.findByUser(userId);
  }

  @Query(() => [Appointment], { name: 'upcomingAppointments' })
  findUpcoming() {
    return this.appointmentsService.findUpcoming();
  }

  @Query(() => [Appointment], { name: 'pastAppointments' })
  findPast() {
    return this.appointmentsService.findPast();
  }

  @Query(() => [Appointment], { name: 'appointmentsByPsychologist' })
  findByPsychologist(@Args('psychologistId', { type: () => String }) psychologistId: string) {
    return this.appointmentsService.findByPsychologist(psychologistId);
  }

  @Mutation(() => Appointment)
  updateAppointment(
    @Args('id', { type: () => String }) id: string,
    @Args('updateAppointmentInput') updateAppointmentInput: UpdateAppointmentInput,
  ) {
    return this.appointmentsService.update(id, updateAppointmentInput);
  }

  @Mutation(() => Appointment)
  confirmAppointment(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.confirm(id);
  }

  @Mutation(() => Appointment)
  cancelAppointment(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.cancel(id);
  }

  @Mutation(() => Appointment)
  removeAppointment(@Args('id', { type: () => String }) id: string) {
    return this.appointmentsService.remove(id);
  }
} 