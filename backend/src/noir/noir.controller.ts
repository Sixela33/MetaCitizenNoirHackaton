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
    try {
      const userData = await this.sumsubService.getApplicantData(req.user.id);
      console.log("Raw user data:", JSON.stringify(userData, null, 2));

      const formattedData = await this.noirService.formatUserDataForWitnessGeneration(userData);
      
      console.log("formattedData:", formattedData);
      const witness = await this.noirService.generateWitness(formattedData);
      console.log("Witness generate d:", !!witness);
      
      const proof = await this.noirService.generateProof(witness.witness);
      console.log("Proof generated:", !!proof);
      
      const verified = await this.noirService.verifyProof(proof);
      console.log("Verification result:", verified);
      
      return proof;
    } catch (error) {
      console.error("Error in generate-proof endpoint:", error);
      throw error;
    }
  }
}
