import { Injectable } from '@nestjs/common';
import { User } from '../../domain/user';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}
  async getUserById(id: number): Promise<User> {
    return this.usersRepository.findOne({
      where: {
        id,
      },
    });
  }

  async createUser(user: User): Promise<User> {
    return this.usersRepository.save(user);
  }

  async updateUser(id: number, data: Partial<User>): Promise<User> {
    const user = await this.getUserById(id);
    if (!user) {
      throw new Error('User not found');
    }
    Object.assign(user, data);
    return this.usersRepository.save(user);
  }

  async deleteUser(id: number): Promise<void> {
    await this.usersRepository.delete(id);
  }
}
