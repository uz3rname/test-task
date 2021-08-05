import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { RoomController } from '../src/room/room.controller';
import { BookingController } from '../src/booking/booking.controller';
import { StatsController } from '../src/stats/stats.controller';
import { RoomService } from '../src/room/room.service';
import { BookingService } from '../src/booking/booking.service';
import { MockStoreService } from '../src/store/mock-store.service';
import { StoreService } from '../src/store/store.service';
import { setupStore } from '../src/util/test/setup-store';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      controllers: [RoomController, BookingController, StatsController],
      providers: [
        { provide: StoreService, useClass: MockStoreService },
        RoomService,
        BookingService,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();
    const store = app.get<StoreService>(StoreService);
    await setupStore(store);
  });

  describe('GET /room/available', () => {
    it('return 2 rooms', () => {
      return request(app.getHttpServer())
        .get('/room/available?checkIn=2020-02-10&checkOut=2020-02-15')
        .expect(200, {
          rooms: [
            {
              id: 1,
              roomNumber: '100',
            },
            {
              id: 2,
              roomNumber: '200',
            },
          ],
        });
    });
  });

  describe('GET /booking/cost', () => {
    it('return cost', () => {
      return request(app.getHttpServer())
        .get('/booking/cost?checkIn=2020-01-01&checkOut=2020-01-10')
        .expect(200, {
          cost: 9000,
        });
    });

    it('invalid period', () => {
      return request(app.getHttpServer())
        .get('/booking/cost?checkIn=2020-10-01&checkOut=2020-01-10')
        .expect(400);
    });
  });

  describe('POST /booking', () => {
    it('create booking', () => {
      const checkIn = new Date(2021, 9, 1).toISOString();
      const checkOut = new Date(2021, 9, 10).toISOString();

      return request(app.getHttpServer())
        .post('/booking')
        .send({ roomId: 1, checkIn, checkOut })
        .expect(201, {
          id: 3,
          roomId: 1,
          checkIn,
          checkOut,
        });
    });

    it('room is unavailable', () => {
      const checkIn = new Date(2020, 0, 10).toISOString();
      const checkOut = new Date(2020, 0, 15).toISOString();

      return request(app.getHttpServer())
        .post('/booking')
        .send({ roomId: 1, checkIn, checkOut })
        .expect(400);
    });
  });
});
