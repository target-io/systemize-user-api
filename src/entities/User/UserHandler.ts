import { UserInterface } from './UserInterface';
import UserController from './UserController';

/**
 * User Handler class for Redis subscribers & Kakfa Consumers 
 *
 * @export
 * @class UserHandler
 */
export default class UserHandler extends UserController {
  constructor() {
    super();
  }

  async signin(data) {
    return await this.findOne({ filter: data });
  }
}