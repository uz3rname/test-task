import { DynamicModule, Global, Module } from '@nestjs/common';
import { Pool, ClientConfig } from 'pg';
import { PG_POOL_TOKEN } from './store.constants';
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
          provide: PG_POOL_TOKEN,
          useFactory: async () => {
            const pool = new Pool(config);
            await pool.connect();

            return pool;
          },
        },
      ],
      exports: [PG_POOL_TOKEN],
    };
  }
}
