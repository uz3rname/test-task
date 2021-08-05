import { Injectable } from '@nestjs/common';
import { Room } from '../common/common.types';
import { StoreService } from '../store/store.service';

@Injectable()
export class RoomService {
  constructor(private readonly store: StoreService) {}

  getAvailable(checkIn: Date, checkOut: Date): Promise<Room[]> {
    return this.store.getAvailableRooms(checkIn, checkOut);
  }
}
