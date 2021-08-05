import { ArgumentMetadata, BadRequestException } from '@nestjs/common';
import { ParseDatePipe } from './parse-date.pipe';

describe('ParseDatePipe', () => {
  let pipe: ParseDatePipe;
  const metadata: ArgumentMetadata = {
    data: 'param',
    type: 'query',
  };

  beforeEach(() => {
    pipe = new ParseDatePipe();
  });

  it('should be defined', () => {
    expect(pipe).toBeDefined();
  });

  const date = new Date('2020-01-01');

  it('parse date string', () => {
    expect(pipe.transform('2020-01-01', metadata).getTime()).toBe(
      date.getTime(),
    );
  });

  it('fail', () => {
    expect(() => pipe.transform('abcdef', metadata)).toThrow(
      BadRequestException,
    );
  });
});
