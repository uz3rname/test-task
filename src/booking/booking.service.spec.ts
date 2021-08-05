import { Test, TestingModule } from '@nestjs/testing';
import { MockStoreService } from '../store/mock-store.service';
import { StoreService } from '../store/store.service';
import {
  InvalidCheckInDayException,
  InvalidCheckOutDayException,
  InvalidPeriodException,
  NonexistentRoomException,
  RoomIsUnavailableException,
} from './booking.exceptions';
import { BookingService } from './booking.service';
import { setupStore } from '../util/test/setup-store';

describe('BookingService', () => {
  let service: BookingService;
  let store: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: StoreService, useClass: MockStoreService },
        BookingService,
      ],
    }).compile();

    service = module.get<BookingService>(BookingService);
    store = module.get<StoreService>(StoreService);
    await setupStore(store);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('room does not exist', async () => {
      await expect(
        service.create(100, new Date(2020, 0, 1), new Date(2020, 0, 0)),
      ).rejects.toThrow(NonexistentRoomException);
    });

    it('invalid check in day', async () => {
      await expect(
        service.create(1, new Date(2021, 7, 5), new Date(2021, 7, 15)),
      ).rejects.toThrow(InvalidCheckInDayException);
    });

    it('invalid check out day', async () => {
      await expect(
        service.create(1, new Date(2021, 7, 6), new Date(2021, 7, 9)),
      ).rejects.toThrow(InvalidCheckOutDayException);
    });

    it('invalid period', async () => {
      await expect(
        service.create(1, new Date(2021, 7, 6), new Date(2020, 7, 1)),
      ).rejects.toThrow(InvalidPeriodException);
    });

    it('room is unavailable', async () => {
      await expect(
        service.create(1, new Date(2020, 0, 5), new Date(2020, 0, 10)),
      ).rejects.toThrow(RoomIsUnavailableException);
    });

    it('create success', async () => {
      const booking = await service.create(
        1,
        new Date(2020, 1, 15),
        new Date(2020, 1, 21),
      );

      expect(booking).toStrictEqual({
        id: 3,
        roomId: 1,
        checkIn: new Date(2020, 1, 15),
        checkOut: new Date(2020, 1, 21),
      });
    });
  });

  describe('calculateCost', () => {
    it('invalid period', () => {
      expect(() => {
        service.calculateCost(new Date(2020, 0, 0), new Date(2019, 0, 0));
      }).toThrow(InvalidPeriodException);
    });

    it('calculate cost', () => {
      expect(
        service.calculateCost(new Date(2020, 0, 0), new Date(2020, 0, 10)),
      ).toBe(10000);

      expect(
        service.calculateCost(new Date(2020, 0, 0), new Date(2020, 0, 15)),
      ).toBe(15000 * 0.9);

      expect(
        service.calculateCost(new Date(2020, 0, 0), new Date(2020, 0, 30)),
      ).toBe(30000 * 0.8);
    });
  });
});
