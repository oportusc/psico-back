import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { PsychologistsService } from './psychologists.service';
import { Psychologist } from './psychologist.entity';
import { CreatePsychologistInput } from './dto/create-psychologist.input';
import { UpdatePsychologistInput } from './dto/update-psychologist.input';

@Resolver(() => Psychologist)
export class PsychologistsResolver {
  constructor(private readonly psychologistsService: PsychologistsService) {}

  @Mutation(() => Psychologist)
  createPsychologist(
    @Args('createPsychologistInput') createPsychologistInput: CreatePsychologistInput,
  ): Promise<Psychologist> {
    return this.psychologistsService.create(createPsychologistInput);
  }

  @Query(() => [Psychologist], { name: 'psychologists' })
  findAll(): Promise<Psychologist[]> {
    return this.psychologistsService.findAll();
  }

  @Query(() => [Psychologist], { name: 'psychologistsAll' })
  findAllIncludingInactive(): Promise<Psychologist[]> {
    return this.psychologistsService.findAllIncludingInactive();
  }

  @Query(() => Psychologist, { name: 'psychologist' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Psychologist> {
    return this.psychologistsService.findOne(id);
  }

  @Query(() => Psychologist, { name: 'psychologistByEmail' })
  findByEmail(@Args('email') email: string): Promise<Psychologist> {
    return this.psychologistsService.findByEmail(email);
  }

  @Query(() => Psychologist, { name: 'psychologistByCalendarId' })
  findByGoogleCalendarId(
    @Args('googleCalendarId') googleCalendarId: string,
  ): Promise<Psychologist> {
    return this.psychologistsService.findByGoogleCalendarId(googleCalendarId);
  }

  @Mutation(() => Psychologist)
  updatePsychologist(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePsychologistInput') updatePsychologistInput: UpdatePsychologistInput,
  ): Promise<Psychologist> {
    return this.psychologistsService.update(id, updatePsychologistInput);
  }

  @Mutation(() => Psychologist)
  removePsychologist(@Args('id', { type: () => ID }) id: string): Promise<Psychologist> {
    return this.psychologistsService.remove(id);
  }

  @Mutation(() => Psychologist)
  activatePsychologist(@Args('id', { type: () => ID }) id: string): Promise<Psychologist> {
    return this.psychologistsService.activate(id);
  }

  @ResolveField(() => Int)
  async appointmentsCount(@Parent() psychologist: Psychologist): Promise<number> {
    return this.psychologistsService.countAppointments(psychologist.id);
  }

  @ResolveField(() => String)
  async fullName(@Parent() psychologist: Psychologist): Promise<string> {
    return `${psychologist.firstName} ${psychologist.lastName}`;
  }
} 