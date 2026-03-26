import { Controller, Post, Get, Body, Param } from '@nestjs/common';
import { AppealsService } from './appeals.service';
import { AppealCategory } from './appeal.entity';

@Controller('appeals')
export class AppealsController {
  constructor(private appealsService: AppealsService) {}

  @Post()
  async create(@Body() body: {
    userId: string;
    category: AppealCategory;
    subject: string;
    message: string;
    phone?: string;
    email?: string;
    attachments?: string[];
  }) {
    return this.appealsService.create(body);
  }

  @Get('user/:userId')
  async getUserAppeals(@Param('userId') userId: string) {
    return this.appealsService.findByUser(userId);
  }

  @Get(':id')
  async getAppeal(@Param('id') id: string) {
    return this.appealsService.findById(id);
  }
}
