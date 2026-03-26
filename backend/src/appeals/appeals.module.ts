import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Appeal } from './appeal.entity';
import { AppealsService } from './appeals.service';
import { AppealsController } from './appeals.controller';

@Module({
  imports: process.env.DATABASE_URL ? [TypeOrmModule.forFeature([Appeal])] : [],
  providers: [AppealsService],
  controllers: [AppealsController],
})
export class AppealsModule {}
