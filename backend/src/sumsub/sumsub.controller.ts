import { Controller, Get, Query } from '@nestjs/common';
import { SumsubService } from './sumsub.service';

@Controller('sumsub')
export class SumsubController {
  constructor(private readonly sumsubService: SumsubService) {}

  @Get('access-token')
  async getAccessToken() {
    const userId = 'user-' + Math.random().toString(36).substring(2, 15); // Generate unique session id
    return this.sumsubService.generateAccessToken(userId, 'id-and-liveness', 600);
  }
}
