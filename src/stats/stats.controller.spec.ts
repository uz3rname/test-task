import { Test } from '@nestjs/testing';
import { Pool } from 'pg';
import {
  BOOKINGS_TABLE_TOKEN,
  PG_POOL_TOKEN,
  ROOMS_TABLE_TOKEN,
} from '../store/store.constants';
import { StoreService } from '../store/store.service';
import { StatsController } from './stats.controller';
import { config } from 'dotenv';
import { promises as fsp } from 'fs';

config();
const maybe = process.env.DB_NAME ? describe : describe.skip;

maybe('StatsController', () => {
  let controller: StatsController;
  let store: StoreService;
  let pool: Pool | undefined = undefined;

  beforeEach(async () => {
    config();
    pool = new Pool({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    });

    const module = await Test.createTestingModule({
      providers: [
        { provide: ROOMS_TABLE_TOKEN, useValue: 'test_rooms' },
        { provide: BOOKINGS_TABLE_TOKEN, useValue: 'test_bookings' },
        {
          provide: PG_POOL_TOKEN,
          useValue: pool,
        },
        StoreService,
      ],
      controllers: [StatsController],
    }).compile();

    controller = module.get<StatsController>(StatsController);
    store = module.get<StoreService>(StoreService);

    await store.onModuleInit();

    if (pool) {
      const input = JSON.parse(
        await fsp.readFile('./test-data/data.json', 'utf8'),
      );
      for (const [roomNumber] of input.rooms) {
        await store.createRoom(roomNumber);
      }
      for (const [roomId, start, end] of input.bookings) {
        await store.createBooking(roomId, new Date(start), new Date(end));
      }
    }
  });

  it('occupancy stats', async () => {
    if (pool) {
      const result = JSON.parse(
        await fsp.readFile('./test-data/occupancy.json', 'utf8'),
      );
      expect(await controller.getAverageOccupancyByMonth()).toEqual(result);
    } else {
      expect(true).toBe(true);
    }
  });

  afterEach(async () => {
    if (pool) {
      await pool.query('DROP TABLE test_bookings');
      await pool.query('DROP TABLE test_rooms');
      await pool.end();
    }
  });
});
