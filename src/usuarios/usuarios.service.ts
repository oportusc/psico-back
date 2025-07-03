import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Usuario } from './usuario.entity';
import { CreateUsuarioInput } from './dto/create-usuario.input';
import { UpdateUsuarioInput } from './dto/update-usuario.input';

@Injectable()
export class UsuariosService {
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  async create(createUsuarioInput: CreateUsuarioInput): Promise<Usuario> {
    // Verificar si ya existe un usuario con el mismo RUT o correo
    const existingUsuario = await this.usuariosRepository.findOne({
      where: [
        { rut: createUsuarioInput.rut },
        { correo: createUsuarioInput.correo }
      ]
    });

    if (existingUsuario) {
      throw new ConflictException('Ya existe un usuario con este RUT o correo');
    }

    const usuario = this.usuariosRepository.create(createUsuarioInput);
    return this.usuariosRepository.save(usuario);
  }

  async findAll(): Promise<Usuario[]> {
    return this.usuariosRepository.find({
      relations: ['consultas']
    });
  }

  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { id },
      relations: ['consultas']
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con ID ${id} no encontrado`);
    }

    return usuario;
  }

  async findByRut(rut: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOne({
      where: { rut },
      relations: ['consultas']
    });

    if (!usuario) {
      throw new NotFoundException(`Usuario con RUT ${rut} no encontrado`);
    }

    return usuario;
  }

  async update(id: string, updateUsuarioInput: UpdateUsuarioInput): Promise<Usuario> {
    const usuario = await this.findOne(id);

    // Si se está actualizando el RUT o correo, verificar que no exista otro usuario con esos datos
    if (updateUsuarioInput.rut || updateUsuarioInput.correo) {
      const existingUsuario = await this.usuariosRepository.findOne({
        where: [
          { rut: updateUsuarioInput.rut || usuario.rut },
          { correo: updateUsuarioInput.correo || usuario.correo }
        ]
      });

      if (existingUsuario && existingUsuario.id !== id) {
        throw new ConflictException('Ya existe otro usuario con este RUT o correo');
      }
    }

    Object.assign(usuario, updateUsuarioInput);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: string): Promise<Usuario> {
    const usuario = await this.findOne(id);
    await this.usuariosRepository.remove(usuario);
    return usuario;
  }
} 