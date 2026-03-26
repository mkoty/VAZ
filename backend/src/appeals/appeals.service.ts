import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appeal, AppealStatus } from './appeal.entity';

@Injectable()
export class AppealsService {
  // Mock storage для локальной разработки без БД
  private mockAppeals: Appeal[] = [];
  private mockIdCounter = 1;

  constructor(
    @Optional()
    @InjectRepository(Appeal)
    private appealsRepository?: Repository<Appeal>,
  ) {}

  async create(appealData: Partial<Appeal>): Promise<Appeal> {
    if (this.appealsRepository) {
      const appeal = this.appealsRepository.create(appealData);
      return this.appealsRepository.save(appeal);
    }

    // Mock создание обращения
    const appeal: Appeal = {
      id: String(this.mockIdCounter++),
      ...appealData,
      status: AppealStatus.NEW,
      createdAt: new Date(),
      updatedAt: new Date(),
    } as Appeal;
    this.mockAppeals.push(appeal);
    console.log('📝 Создано обращение:', appeal);
    return appeal;
  }

  async findByUser(userId: string): Promise<Appeal[]> {
    if (this.appealsRepository) {
      return this.appealsRepository.find({
        where: { userId },
        order: { createdAt: 'DESC' },
      });
    }

    // Mock получение обращений пользователя
    return this.mockAppeals
      .filter(a => a.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async findById(id: string): Promise<Appeal | null> {
    if (this.appealsRepository) {
      return this.appealsRepository.findOne({ where: { id } });
    }

    // Mock получение обращения
    return this.mockAppeals.find(a => a.id === id) || null;
  }
}
