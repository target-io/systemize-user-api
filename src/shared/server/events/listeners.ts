import consume from './consumers';
import subscribe from './subscribers';

export default {
  keepListening() {
    console.log('User microservice started listening');
    consume.kafkaConsumers();
    subscribe.redisSubscribers();
  },
};
