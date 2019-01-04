import { UserInterface } from './UserInterface';
import { AController } from '../../shared/class/AbstractController';

import UserModel from './UserModel';

export default class UserController extends AController <UserInterface> {
  public cacheKey: String = 'user-';

  constructor() {
    super(UserModel);
  }
}