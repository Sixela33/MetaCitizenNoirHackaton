import { Controller, Get, Request, UseGuards } from '@nestjs/common';
import { NoirService } from './noir.service';
import { SumsubService } from 'src/sumsub/services/sumsub.service';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';

@Controller('noir')
export class NoirController {
  constructor(
    private readonly noirService: NoirService,
    private readonly sumsubService: SumsubService,
  ) {}

  @UseGuards(JwtAuthGuard)
  @Get('generate-proof')
  async generateProof(@Request() req: any) {
    const userData = await this.sumsubService.getApplicantData(req.user.id);

    const formattedData = await this.noirService.formatUserDataForWitnessGeneration(userData);

    const witness = await this.noirService.generateWitness(formattedData);
    const proof = await this.noirService.generateProof(witness.witness);
    return proof
  }
}
