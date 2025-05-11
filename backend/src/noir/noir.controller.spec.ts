import { Test, TestingModule } from '@nestjs/testing';
import { NoirController } from './noir.controller';
import { NoirService } from './noir.service';

describe('NoirController', () => {
  let controller: NoirController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [NoirController],
      providers: [NoirService],
    }).compile();

    controller = module.get<NoirController>(NoirController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
