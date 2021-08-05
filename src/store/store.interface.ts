import {
  Booking,
  OccupancyByMonthReportEntry,
  Room,
} from '../common/common.types';

export interface Store {
  getRoom(roomId: number): Promise<Room | undefined>;
  createRoom(roomNumber: string): Promise<Room>;
  createBooking(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Booking>;
  getAvailableRooms(checkIn: Date, checkOut: Date): Promise<Room[]>;
  isRoomAvailable(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean>;
  getAverageOccupancyByMonth(): Promise<OccupancyByMonthReportEntry[]>;
}
