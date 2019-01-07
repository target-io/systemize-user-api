import GenericException from '../../exceptions/GenericException';
import RedisController from '../../class/RedisController';
import UserHandler from '../../../entities/User/UserHandler';

const redis = new RedisController();
const handler = new UserHandler();

export default {
  redisSubscribers() {
    console.log('redis started subscribing to channels');
    // auth requests signin handler channel
    authSigninChannel();
  },
};

const authSigninChannel = () => {
  const subscriber = redis.newClient();
  const publisher = redis.newClient();
  subscriber.on('message', async (channel, message) => {
    if (channel !== 'auth-user-signin-request') {
      console.log('xxxxxxxx----it should never happen----xxxxxxxx');
      return;
    }
    const user = await handler.signin(message);
    console.log('user got signin in redis subscribe');
    console.log(user);
    publisher.publish('user-auth-signin-response', JSON.stringify(user));
  });
  subscriber.subscribe('auth-user-signin-request');
};
