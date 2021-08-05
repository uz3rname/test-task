import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { RequiredParamPipe } from './required.pipe';

describe('RequiredParamPipe', () => {
  let pipe: RequiredParamPipe;
  const metadata: ArgumentMetadata = {
    data: 'param',
    type: 'query',
  };

  beforeEach(() => {
    pipe = new RequiredParamPipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  it('ok', () => {
    expect(pipe.transform(1, metadata)).toBe(1);
  });

  it('fail', () => {
    expect(() => pipe.transform(undefined, metadata)).toThrow(
      BadRequestException,
    );
  });
});
