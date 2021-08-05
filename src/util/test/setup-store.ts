import { StoreService } from '../../store/store.service';

export async function setupStore(store: StoreService) {
  await store.createRoom('100');
  await store.createRoom('200');
  await store.createBooking(1, new Date(2020, 0, 1), new Date(2020, 0, 31));
  await store.createBooking(2, new Date(2020, 0, 15), new Date(2020, 0, 31));
}
