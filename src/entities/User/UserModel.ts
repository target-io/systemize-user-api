import { Schema, model } from 'mongoose';
import * as mongoose from 'mongoose';

mongoose.pluralize(null);

const userSchema = new Schema({
  _organisationId: Schema.Types.ObjectId,
  firstName: String,
  lastName: String,
  email: String,
  password: String,
  phone: Number,
  deleted: Boolean,
  active: Boolean,
}, {
  timestamps: true
});

const UserModel = model('User', userSchema);

export default UserModel;