import { Test, TestingModule } from '@nestjs/testing';
import { NoirService } from './noir.service';

describe('NoirService', () => {
  let service: NoirService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [NoirService],
    }).compile();

    service = module.get<NoirService>(NoirService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
