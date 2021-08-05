import { Controller, Post } from '@nestjs/common';
import { ApiProduces, ApiTags } from '@nestjs/swagger';
import { randomInt } from 'crypto';
import {
  InvalidCheckInDayException,
  InvalidCheckOutDayException,
  RoomIsUnavailableException,
} from '../booking/booking.exceptions';
import { BookingService } from '../booking/booking.service';
import { Room } from '../common/common.types';
import { StoreService } from '../store/store.service';

const copyDate = (date: Date) =>
  new Date(date.getFullYear(), date.getMonth(), date.getDate());

const populateStart = copyDate(new Date());
const populateEnd = new Date(
  populateStart.getFullYear() + 1,
  populateStart.getMonth(),
  populateStart.getDate(),
);

@Controller('populate')
@ApiTags('populate')
@ApiProduces('text/plain')
export class PopulateController {
  constructor(
    private readonly store: StoreService,
    private readonly bookingService: BookingService,
  ) {}

  @Post()
  async populate() {
    const rooms: Room[] = [];
    for (let i = 100; i < 110; i++) {
      const room = await this.store.createRoom(`${i}`);
      rooms.push(room);
    }

    const start = copyDate(populateStart);

    for (let i = 0; i < 100; i++) {
      if (start.getTime() >= populateEnd.getTime()) {
        start.setFullYear(populateStart.getFullYear());
        start.setMonth(populateStart.getMonth());
      }
      const end = copyDate(start);
      end.setDate(end.getDate() + randomInt(2, 45));
      let room = 0;

      while (true) {
        try {
          if (room >= rooms.length) {
            start.setDate(start.getDate() + 1);
            end.setDate(end.getDate() + 1);
            room = 0;
          }
          await this.bookingService.create(rooms[room].id, start, end);
          start.setDate(start.getDate() + randomInt(0, 5));
          break;
        } catch (err) {
          if (err instanceof InvalidCheckInDayException) {
            start.setDate(start.getDate() + 1);
            continue;
          } else if (err instanceof InvalidCheckOutDayException) {
            end.setDate(end.getDate() + 1);
            continue;
          } else if (err instanceof RoomIsUnavailableException) {
            room += 1;
            continue;
          }
          continue;
        }
      }
    }

    return 'OK';
  }
}
