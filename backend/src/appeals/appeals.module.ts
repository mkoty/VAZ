import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appeal } from './appeal.entity';
import { AppealsService } from './appeals.service';
import { AppealsController } from './appeals.controller';
import { EmailModule } from '../email/email.module';

@Module({
  imports: [
    ...(process.env.DATABASE_URL ? [TypeOrmModule.forFeature([Appeal])] : []),
    EmailModule,
  ],
  providers: [AppealsService],
  controllers: [AppealsController],
})
export class AppealsModule {}
