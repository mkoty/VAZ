import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  // Mock storage для локальной разработки без БД
  private mockUsers: User[] = [];
  private mockIdCounter = 1;

  constructor(
    @Optional()
    @InjectRepository(User)
    private usersRepository?: Repository<User>,
  ) {}

  async findByPhone(phone: string): Promise<User | null> {
    if (this.usersRepository) {
      return this.usersRepository.findOne({ where: { phone } });
    }
    return this.mockUsers.find(u => u.phone === phone) || null;
  }

  async findByEmail(email: string): Promise<User | null> {
    if (this.usersRepository) {
      return this.usersRepository.findOne({ where: { email } });
    }
    return this.mockUsers.find(u => u.email === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    if (this.usersRepository) {
      return this.usersRepository.findOne({ where: { id } });
    }
    return this.mockUsers.find(u => u.id === id) || null;
  }

  async create(userData: Partial<User>): Promise<User> {
    if (this.usersRepository) {
      const user = this.usersRepository.create(userData);
      return this.usersRepository.save(user);
    }

    // Mock создание пользователя
    const user: User = {
      id: String(this.mockIdCounter++),
      ...userData,
      createdAt: new Date(),
    } as User;
    this.mockUsers.push(user);
    return user;
  }

  async update(id: string, userData: Partial<User>): Promise<User> {
    if (this.usersRepository) {
      await this.usersRepository.update(id, userData);
      return this.findById(id);
    }

    // Mock обновление
    const userIndex = this.mockUsers.findIndex(u => u.id === id);
    if (userIndex >= 0) {
      this.mockUsers[userIndex] = { ...this.mockUsers[userIndex], ...userData };
      return this.mockUsers[userIndex];
    }
    return null;
  }
}
