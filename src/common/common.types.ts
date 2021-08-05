import { ApiProperty } from '@nestjs/swagger';

export class Room {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  roomNumber!: string;
}

export class Booking {
  @ApiProperty()
  id!: number;

  @ApiProperty()
  roomId!: number;

  @ApiProperty()
  checkIn!: Date;

  @ApiProperty()
  checkOut!: Date;
}

export class OccupancyByMonthReportEntry {
  @ApiProperty()
  month!: string;

  @ApiProperty()
  avgOccupancy!: number;
}
