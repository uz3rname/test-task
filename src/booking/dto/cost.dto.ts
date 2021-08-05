import { ApiProperty } from '@nestjs/swagger';

export class CostDTO {
  @ApiProperty()
  cost!: number;
}
