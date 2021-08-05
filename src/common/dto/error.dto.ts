import { ApiProperty } from '@nestjs/swagger';

export class ErrorDTO {
  @ApiProperty()
  statusCode!: number;

  @ApiProperty()
  message!: string;

  @ApiProperty()
  error!: string;
}
