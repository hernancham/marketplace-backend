import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
      return await this.userRepository.save(createUserDto);
    }
  
    async findAll() {
      return await this.userRepository.find();
    }
  
    async findOne(id: string) {
      return await this.userRepository.findOneBy({ id });
    }
  
    async findOneByEmail(email: string) {
      return await this.userRepository.findOneBy({ email });
    }
  
    async update(id: string, updateUserDto: UpdateUserDto) {
      return await this.userRepository.update(id, updateUserDto);
    }
  
    async remove(id: string) {
      return await this.userRepository.softDelete(id);
    }
}
