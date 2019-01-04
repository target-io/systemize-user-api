import { createClient, RedisClient } from 'redis';
import { promisify } from 'util';
import env from '../../config/env';

export default class RedisController {
  private client: RedisClient;
  private getAsync;
  private setAsync;

  constructor() {
    this.client = createClient({ url: env.redis_url });
    this.getAsync = promisify(this.client.get).bind(this.client);
    this.setAsync = promisify(this.client.set).bind(this.client);
  }

  /**
   * Get session or cache values from Redis
   *
   * @param {string} key
   * @returns {Promise<any>}
   * @memberof RedisController
   */
  getCache(key: string): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        const result = await this.getAsync(key);
        if (result) {
          return resolve (JSON.parse(result));
        }
        return resolve(null);
      }
      catch (err) {
        return reject(err);
      }
    });
  }

  /**
   * Set session & cache values in redis
   *
   * @param {string} key
   * @param {*} value
   * @param {string} [operation='EX']
   * @param {number} [expireTimer=15] expireTimer in seconds
   * @returns {Promise<any>}
   * @memberof RedisController
   */
  setCache(key: string, value: any, operation: string = 'EX', expireTimer = 15): Promise<any> {
    return new Promise(async (resolve, reject) => {
      try {
        await this.setAsync(key, JSON.stringify(value), operation, expireTimer);
        return resolve(true);
      }
      catch (err) {
        return reject(err);
      }
    });
  }
}