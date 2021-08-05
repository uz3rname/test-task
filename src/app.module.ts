import { Module } from '@nestjs/common';
import { StoreModule } from './store/store.module';
import { RoomController } from './room/room.controller';
import { BookingController } from './booking/booking.controller';
import { config } from 'dotenv';
import { RoomService } from './room/room.service';
import { BookingService } from './booking/booking.service';
import { PopulateController } from './populate/populate.controller';
import { StatsController } from './stats/stats.controller';

config();

@Module({
  imports: [
    StoreModule.forRoot({
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT || '5432'),
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASS,
    }),
  ],
  controllers: [
    RoomController,
    BookingController,
    PopulateController,
    StatsController,
  ],
  providers: [RoomService, BookingService],
})
export class AppModule {}
