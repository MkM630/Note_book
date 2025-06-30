import mongoose, { Document, Schema, models } from 'mongoose';

export interface User extends Document {
  username: string;
  password?: string;
  fullName: string;
  age: number;
}

const UserSchema = new Schema<User>({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
    select: false,
  },
  fullName: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
});

export default models.User || mongoose.model<User>('User', UserSchema);
