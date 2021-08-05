import { Injectable } from '@nestjs/common';
import { Booking } from '../common/common.types';
import { StoreService } from '../store/store.service';
import {
  InvalidCheckInDayException,
  InvalidCheckOutDayException,
  InvalidPeriodException,
  NonexistentRoomException,
  RoomIsUnavailableException,
} from './booking.exceptions';

const BASE_PRICE = 1000;

@Injectable()
export class BookingService {
  constructor(private readonly store: StoreService) {}

  async create(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Booking> {
    if (!(await this.store.getRoom(roomId))) {
      throw new NonexistentRoomException(roomId);
    }

    if (checkIn.getTime() >= checkOut.getTime()) {
      throw new InvalidPeriodException();
    }

    if (checkIn.getDay() === 1 || checkIn.getDay() === 4) {
      throw new InvalidCheckInDayException('monday/thursday');
    }

    if (checkOut.getDay() === 1 || checkOut.getDay() === 4) {
      throw new InvalidCheckOutDayException('monday/thursday');
    }

    if (!(await this.store.isRoomAvailable(roomId, checkIn, checkOut))) {
      throw new RoomIsUnavailableException();
    }

    return this.store.createBooking(roomId, checkIn, checkOut);
  }

  calculateCost(checkIn: Date, checkOut: Date): number {
    const delta = ~~((checkOut.getTime() - checkIn.getTime()) / 86400000);

    if (delta <= 0) {
      throw new InvalidPeriodException();
    }
    if (delta > 20) {
      return delta * (BASE_PRICE * 0.8);
    }
    if (delta > 10) {
      return delta * (BASE_PRICE * 0.9);
    }
    return delta * BASE_PRICE;
  }
}
