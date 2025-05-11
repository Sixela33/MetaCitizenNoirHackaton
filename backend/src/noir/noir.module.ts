import { Module } from '@nestjs/common';
import { NoirService } from './noir.service';
import { NoirController } from './noir.controller';
import { SumsubModule } from 'src/sumsub/sumsub.module';

@Module({
  imports: [SumsubModule],
  controllers: [NoirController],
  providers: [NoirService],
})
export class NoirModule {}
