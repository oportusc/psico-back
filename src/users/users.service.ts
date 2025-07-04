import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    // Check if a user with the same RUT or email already exists
    const existingUser = await this.usersRepository.findOne({
      where: [
        { rut: createUserInput.rut },
        { email: createUserInput.email }
      ]
    });

    if (existingUser) {
      throw new ConflictException('A user with this RUT or email already exists');
    }

    const user = this.usersRepository.create(createUserInput);
    return this.usersRepository.save(user);
  }

  async findAll(): Promise<User[]> {
    return this.usersRepository.find({
      relations: ['appointments']
    });
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      relations: ['appointments']
    });

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByRut(rut: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { rut },
      relations: ['appointments']
    });

    if (!user) {
      throw new NotFoundException(`User with RUT ${rut} not found`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    const user = await this.findOne(id);

    // If updating RUT or email, check that no other user has that data
    if (updateUserInput.rut || updateUserInput.email) {
      const existingUser = await this.usersRepository.findOne({
        where: [
          { rut: updateUserInput.rut || user.rut },
          { email: updateUserInput.email || user.email }
        ]
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Another user with this RUT or email already exists');
      }
    }

    Object.assign(user, updateUserInput);
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.usersRepository.remove(user);
    return user;
  }
} 