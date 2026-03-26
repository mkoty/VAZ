import { Injectable, Optional } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Appeal, AppealStatus } from './appeal.entity';
import { EmailService } from '../email/email.service';

@Injectable()
export class AppealsService {
  // Mock storage для локальной разработки без БД
  private mockAppeals: Appeal[] = [];
  private mockIdCounter = 1;

  constructor(
    @Optional()
    @InjectRepository(Appeal)
    private appealsRepository: Repository<Appeal> | undefined,
    private emailService: EmailService,
  ) {}

  async create(appealData: Partial<Appeal>): Promise<Appeal> {
    let appeal: Appeal;

    if (this.appealsRepository) {
      const newAppeal = this.appealsRepository.create(appealData);
      appeal = await this.appealsRepository.save(newAppeal);
    } else {
      // Mock создание обращения
      appeal = {
        id: String(this.mockIdCounter++),
        ...appealData,
        status: AppealStatus.NEW,
        createdAt: new Date(),
        updatedAt: new Date(),
      } as Appeal;
      this.mockAppeals.push(appeal);
    }

    // Отправляем подтверждение на email
    if (appealData.email) {
      try {
        await this.emailService.sendAppealConfirmation(
          appealData.email,
          appeal.id,
        );
        console.log(`✅ Подтверждение обращения отправлено на ${appealData.email}`);
      } catch (error) {
        console.error(`❌ Ошибка отправки email: ${error.message}`);
      }
    }

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
