import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Query,
  UseFilters,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import {
  ApiBody,
  ApiConsumes,
  ApiProduces,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { Booking } from '../common/common.types';
import { ErrorDTO } from '../common/dto/error.dto';
import { ParseDatePipe } from '../common/pipes/parse-date.pipe';
import { RequiredParamPipe } from '../common/pipes/required.pipe';
import { BookingExceptionFilter } from './booking-exception.filter';
import { BookingService } from './booking.service';
import { CostDTO } from './dto/cost.dto';
import { CreateBookingDTO } from './dto/create-booking.dto';

@Controller('booking')
@UseFilters(BookingExceptionFilter)
@ApiTags('booking')
@ApiProduces('application/json')
export class BookingController {
  constructor(private readonly bookingService: BookingService) {}

  @Post()
  @UsePipes(new ValidationPipe({ transform: true }))
  @HttpCode(HttpStatus.CREATED)
  @ApiConsumes('application/json')
  @ApiBody({ type: CreateBookingDTO })
  @ApiResponse({ type: Booking, status: HttpStatus.CREATED })
  @ApiResponse({ type: ErrorDTO, status: HttpStatus.BAD_REQUEST })
  async create(@Body() dto: CreateBookingDTO): Promise<Booking> {
    return this.bookingService.create(dto.roomId, dto.checkIn, dto.checkOut);
  }

  @Get('cost')
  @ApiResponse({ type: CostDTO, status: HttpStatus.OK })
  @ApiResponse({ type: ErrorDTO, status: HttpStatus.BAD_REQUEST })
  async calculateCost(
    @Query('checkIn', RequiredParamPipe, ParseDatePipe) checkIn: Date,
    @Query('checkOut', RequiredParamPipe, ParseDatePipe) checkOut: Date,
  ): Promise<CostDTO> {
    const cost = this.bookingService.calculateCost(checkIn, checkOut);
    return { cost };
  }
}
