import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { User } from './user.entity';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private userModel: Model<User>,
  ) {}

  async create(createUserInput: CreateUserInput): Promise<User> {
    // Check if a user with the same RUT or email already exists
    const existingUser = await this.userModel.findOne({
      $or: [
        { rut: createUserInput.rut },
        { email: createUserInput.email }
      ]
    });

    if (existingUser) {
      throw new ConflictException('A user with this RUT or email already exists');
    }

    const user = new this.userModel(createUserInput);
    return user.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().populate('appointments').exec();
  }

  async findOne(id: string): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user = await this.userModel.findById(id).populate('appointments').exec();

    if (!user) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return user;
  }

  async findByRut(rut: string): Promise<User> {
    const user = await this.userModel.findOne({ rut }).populate('appointments').exec();

    if (!user) {
      throw new NotFoundException(`User with RUT ${rut} not found`);
    }

    return user;
  }

  async update(id: string, updateUserInput: UpdateUserInput): Promise<User> {
    if (!Types.ObjectId.isValid(id)) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    const user = await this.findOne(id);

    // If updating RUT or email, check that no other user has that data
    if (updateUserInput.rut || updateUserInput.email) {
      const existingUser = await this.userModel.findOne({
        $or: [
          { rut: updateUserInput.rut || user.rut },
          { email: updateUserInput.email || user.email }
        ]
      });

      if (existingUser && existingUser.id !== id) {
        throw new ConflictException('Another user with this RUT or email already exists');
      }
    }

    const updatedUser = await this.userModel.findByIdAndUpdate(
      id,
      updateUserInput,
      { new: true }
    ).populate('appointments').exec();

    if (!updatedUser) {
      throw new NotFoundException(`User with ID ${id} not found`);
    }

    return updatedUser;
  }

  async remove(id: string): Promise<User> {
    const user = await this.findOne(id);
    await this.userModel.findByIdAndDelete(id);
    return user;
  }

  async findAppointments(userId: string): Promise<any[]> {
    const user = await this.userModel.findById(userId).populate('appointments');
    return user?.appointments || [];
  }
} 