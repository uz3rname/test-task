import { Test, TestingModule } from '@nestjs/testing';
import { MockStoreService } from '../store/mock-store.service';
import { StoreService } from '../store/store.service';
import { setupStore } from '../util/test/setup-store';
import { RoomService } from './room.service';

describe('RoomService', () => {
  let service: RoomService;
  let store: StoreService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        { provide: StoreService, useClass: MockStoreService },
        RoomService,
      ],
    }).compile();

    service = module.get<RoomService>(RoomService);
    store = module.get<StoreService>(StoreService);
    await setupStore(store);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAvailable', () => {
    it('return 2 rooms', async () => {
      const avail = await service.getAvailable(
        new Date(2020, 1, 10),
        new Date(2020, 1, 15),
      );
      avail.sort((a, b) => a.id - b.id);
      expect(avail).toStrictEqual([
        {
          id: 1,
          roomNumber: '100',
        },
        {
          id: 2,
          roomNumber: '200',
        },
      ]);
    });

    it('return 1 room', async () => {
      const avail = await service.getAvailable(
        new Date(2020, 0, 5),
        new Date(2020, 0, 10),
      );
      expect(avail).toStrictEqual([
        {
          id: 2,
          roomNumber: '200',
        },
      ]);
    });

    it('return 0 rooms', async () => {
      const avail = await service.getAvailable(
        new Date(2020, 0, 20),
        new Date(2020, 0, 25),
      );
      expect(avail).toStrictEqual([]);
    });
  });
});
