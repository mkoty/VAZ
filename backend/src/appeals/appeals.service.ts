import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appeal } from './appeal.entity';

@Injectable()
export class AppealsService {
  constructor(
    @InjectRepository(Appeal)
    private appealsRepository: Repository<Appeal>,
  ) {}

  async create(appealData: Partial<Appeal>): Promise<Appeal> {
    const appeal = this.appealsRepository.create(appealData);
    return this.appealsRepository.save(appeal);
  }

  async findByUser(userId: string): Promise<Appeal[]> {
    return this.appealsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }

  async findById(id: string): Promise<Appeal | null> {
    return this.appealsRepository.findOne({ where: { id } });
  }
}
