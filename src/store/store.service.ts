import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { Pool } from 'pg';
import {
  Booking,
  OccupancyByMonthReportEntry,
  Room,
} from '../common/common.types';
import { PG_POOL_TOKEN } from './store.constants';
import { Store } from './store.interface';

const roomFromRaw = (row: any): Room => ({
  id: row.id,
  roomNumber: row.room_number,
});

const bookingFromRaw = (row: any): Booking => ({
  id: row.id,
  roomId: row.room_id,
  checkIn: row.check_in,
  checkOut: row.check_out,
});

@Injectable()
export class StoreService implements Store, OnModuleInit {
  constructor(@Inject(PG_POOL_TOKEN) private readonly pool: Pool) {}

  async onModuleInit() {
    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS rooms (
        id SERIAL PRIMARY KEY,
        room_number VARCHAR(8) UNIQUE NOT NULL
      )
    `);
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS "idx_rooms_room_number" ON rooms (room_number)
    `);

    await this.pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        room_id INT REFERENCES rooms(id),
        check_in DATE,
        check_out DATE
      )
    `);
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS "idx_bookings_check_in" ON bookings (check_in)
    `);
    await this.pool.query(`
      CREATE INDEX IF NOT EXISTS "idx_bookings_check_out" ON bookings (check_out)
    `);
  }

  async getRoom(roomId: number): Promise<Room | undefined> {
    const result = await this.pool.query('SELECT * FROM rooms WHERE id = $1', [
      roomId,
    ]);
    if (result.rowCount > 0) {
      return {
        id: result.rows[0].id,
        roomNumber: result.rows[0].room_number,
      };
    }
  }

  async createRoom(roomNumber: string): Promise<Room> {
    const result = await this.pool.query(
      'INSERT INTO rooms (room_number) VALUES ($1) RETURNING *',
      [roomNumber],
    );
    return roomFromRaw(result.rows[0]);
  }

  async createBooking(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<Booking> {
    const result = await this.pool.query(
      `
      INSERT INTO bookings (room_id, check_in, check_out)
      VALUES($1, $2, $3)
      RETURNING *
      `,
      [roomId, checkIn, checkOut],
    );
    return bookingFromRaw(result.rows[0]);
  }

  async getAvailableRooms(checkIn: Date, checkOut: Date): Promise<Room[]> {
    const result = await this.pool.query(
      `
      SELECT r.* FROM rooms r
      LEFT JOIN bookings b ON (
        r.id = b.room_id
        AND (
          ($1::date, $2::date + INTERVAL '1 days')
          OVERLAPS (b.check_in, b.check_out + INTERVAL '1 days')
        )
      )
      WHERE b.id IS NULL
      `,
      [checkIn, checkOut],
    );
    return result.rows.map(roomFromRaw);
  }

  async isRoomAvailable(
    roomId: number,
    checkIn: Date,
    checkOut: Date,
  ): Promise<boolean> {
    const result = await this.pool.query(
      `
      SELECT 1 FROM bookings
      WHERE room_id = $1 AND $2 <= check_out AND $3 >= check_in
      `,
      [roomId, checkIn, checkOut],
    );

    return result.rowCount === 0;
  }

  async getAverageOccupancyByMonth(): Promise<OccupancyByMonthReportEntry[]> {
    const result = await this.pool.query(
      `
      SELECT to_char(day, 'YYYY-MM') AS month,
             AVG(
               (
                 SELECT COUNT(1) FROM bookings
                 WHERE day BETWEEN check_in AND check_out
               ) / (SELECT COUNT(1)::float FROM rooms)
             ) * 100 AS "avgOccupancy"
      FROM generate_series(
        (SELECT MIN(check_in) FROM bookings),
        (SELECT MAX(check_out) FROM bookings),
        '1 day'::interval
      ) AS day
      GROUP BY month
      ORDER BY month
      `,
    );
    return <OccupancyByMonthReportEntry[]>result.rows;
  }
}
