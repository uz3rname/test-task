import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsDate, IsNumber } from 'class-validator';

export class CreateBookingDTO {
  @IsNumber()
  @ApiProperty()
  roomId!: number;

  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  checkIn!: Date;

  @Type(() => Date)
  @IsDate()
  @ApiProperty()
  checkOut!: Date;
}
