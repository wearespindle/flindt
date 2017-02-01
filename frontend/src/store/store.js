const productionStore = require('./configureStore.prod');
const devStore = require('./configureStore.dev');

if (process.env.NODE_ENV === 'production' || (location && location.hostname !== 'localhost')) {
    module.exports = productionStore;
} else {
    module.exports = devStore;
}
