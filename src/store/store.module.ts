import { DynamicModule, Global, Module } from '@nestjs/common';
import { Pool, ClientConfig } from 'pg';
import {
  BOOKINGS_TABLE_TOKEN,
  PG_POOL_TOKEN,
  ROOMS_TABLE_TOKEN,
} from './store.constants';
import { StoreService } from './store.service';

@Module({
  providers: [StoreService],
  exports: [StoreService],
})
@Global()
export class StoreModule {
  static forRoot(config: ClientConfig): DynamicModule {
    return {
      module: StoreModule,
      providers: [
        {
          provide: ROOMS_TABLE_TOKEN,
          useValue: 'rooms',
        },
        {
          provide: BOOKINGS_TABLE_TOKEN,
          useValue: 'bookings',
        },
        {
          provide: PG_POOL_TOKEN,
          useFactory: async () => {
            const pool = new Pool(config);

            return pool;
          },
        },
      ],
      exports: [PG_POOL_TOKEN],
    };
  }
}
