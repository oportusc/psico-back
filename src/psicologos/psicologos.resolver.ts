import { Resolver, Query, Mutation, Args, ID, ResolveField, Parent, Int } from '@nestjs/graphql';
import { PsicologosService } from './psicologos.service';
import { Psicologo } from './psicologo.entity';
import { CreatePsicologoInput } from './dto/create-psicologo.input';
import { UpdatePsicologoInput } from './dto/update-psicologo.input';

@Resolver(() => Psicologo)
export class PsicologosResolver {
  constructor(private readonly psicologosService: PsicologosService) {}

  @Mutation(() => Psicologo)
  createPsicologo(
    @Args('createPsicologoInput') createPsicologoInput: CreatePsicologoInput,
  ): Promise<Psicologo> {
    return this.psicologosService.create(createPsicologoInput);
  }

  @Query(() => [Psicologo], { name: 'psicologos' })
  findAll(): Promise<Psicologo[]> {
    return this.psicologosService.findAll();
  }

  @Query(() => [Psicologo], { name: 'psicologosAll' })
  findAllIncludingInactive(): Promise<Psicologo[]> {
    return this.psicologosService.findAllIncludingInactive();
  }

  @Query(() => Psicologo, { name: 'psicologo' })
  findOne(@Args('id', { type: () => ID }) id: string): Promise<Psicologo> {
    return this.psicologosService.findOne(id);
  }

  @Query(() => Psicologo, { name: 'psicologoByEmail' })
  findByEmail(@Args('email') email: string): Promise<Psicologo> {
    return this.psicologosService.findByEmail(email);
  }

  @Query(() => Psicologo, { name: 'psicologoByCalendarId' })
  findByGoogleCalendarId(
    @Args('googleCalendarId') googleCalendarId: string,
  ): Promise<Psicologo> {
    return this.psicologosService.findByGoogleCalendarId(googleCalendarId);
  }

  @Mutation(() => Psicologo)
  updatePsicologo(
    @Args('id', { type: () => ID }) id: string,
    @Args('updatePsicologoInput') updatePsicologoInput: UpdatePsicologoInput,
  ): Promise<Psicologo> {
    return this.psicologosService.update(id, updatePsicologoInput);
  }

  @Mutation(() => Psicologo)
  removePsicologo(@Args('id', { type: () => ID }) id: string): Promise<Psicologo> {
    return this.psicologosService.remove(id);
  }

  @Mutation(() => Psicologo)
  activatePsicologo(@Args('id', { type: () => ID }) id: string): Promise<Psicologo> {
    return this.psicologosService.activate(id);
  }

  @ResolveField(() => Int)
  async consultasCount(@Parent() psicologo: Psicologo): Promise<number> {
    return this.psicologosService.countConsultas(psicologo.id);
  }

  @ResolveField(() => String)
  async nombreCompleto(@Parent() psicologo: Psicologo): Promise<string> {
    return `${psicologo.nombre} ${psicologo.apellidos}`;
  }
} 