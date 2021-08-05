import { Injectable } from '@nestjs/common';
import {
  Booking,
  OccupancyByMonthReportEntry,
  Room,
} from '../common/common.types';
import { Store } from './store.interface';

@Injectable()
export class MockStoreService implements Store {
  private roomCount = 0;
  private readonly rooms: Map<number, Room> = new Map();
  private bookingCount = 0;
  private readonly bookings: Map<number, Booking> = new Map();

  async getRoom(roomId: number): Promise<Room | undefined> {
    return this.rooms.get(roomId);
  }

  async createRoom(roomNumber: string): Promise<Room> {
    const id = ++this.roomCount;
    const room = { id, roomNumber };
    this.rooms.set(id, room);

    return room;
  }

  async createBooking(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Booking> {
    const id = ++this.bookingCount;
    const booking = { id, roomId, checkIn, checkOut };
    this.bookings.set(id, booking);

    return booking;
  }

  async getAvailableRooms(checkIn: Date, checkOut: Date): Promise<Room[]> {
    const result: Room[] = [];
    for (const room of this.rooms.values()) {
      if (await this.isRoomAvailable(room.id, checkIn, checkOut)) {
        result.push(room);
      }
    }

    return result;
  }

  async isRoomAvailable(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    for (const booking of this.bookings.values()) {
      if (
        booking.roomId === roomId &&
        checkIn.getTime() <= booking.checkOut.getTime() &&
        checkOut.getTime() >= booking.checkIn.getTime()
      ) {
        return false;
      }
    }

    return true;
  }

  async getAverageOccupancyByMonth(): Promise<OccupancyByMonthReportEntry[]> {
    return [];
  }
}
