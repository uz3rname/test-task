import { ArgumentsHost, BadRequestException, Catch } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { BookingException } from './booking.exceptions';

@Catch(BookingException)
export class BookingExceptionFilter extends BaseExceptionFilter {
  catch(err: BookingException, host: ArgumentsHost) {
    super.catch(new BadRequestException(`${err}`), host);
  }
}
