import { Module } from '@nestjs/common';
import { SumsubService } from './sumsub.service';
import { SumsubController } from './sumsub.controller';

@Module({
  controllers: [SumsubController],
  providers: [SumsubService],
})
export class SumsubModule {}
