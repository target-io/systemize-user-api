import { Request, Response, NextFunction } from 'express';
import { CREATED, OK } from 'http-status-codes';

import UserController from './UserController';

import GenericException from '../../shared/exceptions/GenericException';
import RedisController from '../../shared/class/RedisController';
import KafkaController from '../../shared/class/KafkaController';

const redis = new RedisController();
const kafka = new KafkaController();
const userObj = new UserController();

export const create = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = await userObj.save(req.body);
    kafka.passData([{
      topic: 'user-to-org-topic',
      messages: JSON.stringify(user),
      key: 'newUser',
      partition: 0,
      timestamp: Date.now(),
    }]);
    res.status(CREATED).send(user);
  } catch (err) {
    next(new GenericException({ name: err.name, message: err.message }));
  }
};

export const list = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await userObj.find({});
    res.status(OK).send(users);
  }
  catch (err) {
    next(new GenericException({ name: err.name, message: err.message }));
  }
};

export const get = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const user = await redis.getCache(`${userObj.cacheKey}${userId}`);
    res.status(OK).send(user);
  } catch (err) {
    next(new GenericException({ name: err.name, message: err.message }));
  }
};

export const update = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    let user = await redis.getCache(`${userObj.cacheKey}${userId}`);
    user = { ...user, ...req.body };
    await userObj.update(user);
    res.status(OK).send(user);
  } catch (err) {
    next(new GenericException({ name: err.name, message: err.message }))
  }
};

export const cache = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    // check user already in cache
    let user = await redis.getCache(`${userObj.cacheKey}${userId}`);
    if (user) {
      return next();
    }
    // get user from db & set cache
    user = await userObj.findById(userId);
    if (user) {
      await redis.setCache(`${userObj.cacheKey}${userId}`, user);
      return next();
    }
    throw new Error('Invalid user id');
  } catch (err) {
    next(new GenericException({ name: err.name, message: err.message }));
  }
};
