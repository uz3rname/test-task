import { Controller, Get, HttpStatus, Query } from '@nestjs/common';
import { ApiProduces, ApiResponse, ApiTags } from '@nestjs/swagger';
import { ErrorDTO } from '../common/dto/error.dto';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';
import { RequiredParamPipe } from '../common/pipes/required.pipe';
import { AvailRoomsDTO } from './dto/avail-rooms.dto';
import { RoomService } from './room.service';

@Controller('room')
@ApiProduces('application/json')
@ApiTags('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  @Get('available')
  @ApiResponse({ type: AvailRoomsDTO, status: HttpStatus.OK })
  @ApiResponse({ type: ErrorDTO, status: HttpStatus.BAD_REQUEST })
  async getAvailable(
    @Query('checkIn', RequiredParamPipe, ParseDatePipe) checkIn: Date,
    @Query('checkOut', RequiredParamPipe, ParseDatePipe) checkOut: Date,
  ): Promise<AvailRoomsDTO> {
    const rooms = await this.roomService.getAvailable(checkIn, checkOut);
    return { rooms };
  }
}
