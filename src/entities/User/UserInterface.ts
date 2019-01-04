import { IMongoModel } from '../../shared/interfaces/IMongoModel';
export interface UserInterface extends IMongoModel {
  [email: string]: string;
  [phone: number]: string;
}