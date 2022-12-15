import { Test, TestingModule } from '@nestjs/testing';
import { DomStreamGateway } from './dom-stream.gateway';

describe('DomStreamGateway', () => {
  let gateway: DomStreamGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [DomStreamGateway],
    }).compile();

    gateway = module.get<DomStreamGateway>(DomStreamGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
