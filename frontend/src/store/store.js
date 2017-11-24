import productionStore from './configureStore.prod';
import devStore from './configureStore.dev';

export default (process.env.NODE_ENV === 'production' || (location && location.hostname !== 'localhost')
  ? productionStore
  : devStore);
