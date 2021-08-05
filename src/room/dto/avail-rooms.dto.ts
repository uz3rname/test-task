import { ApiProperty } from '@nestjs/swagger';
import { Room } from '../../common/common.types';

export class AvailRoomsDTO {
  @ApiProperty({ type: [Room] })
  rooms!: Room[];

  constructor(params: AvailRoomsDTO) {
    Object.assign(this, params);
  }
}
