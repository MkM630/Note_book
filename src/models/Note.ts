import mongoose, { Document, Schema, models, Types } from 'mongoose';

export interface Note extends Document {
  _id: Types.ObjectId;
  title: string;
  description?: string;
  color?: string;
  owner: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const NoteSchema = new Schema<Note>(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    color: {
      type: String,
      default: '#FFFFFF',
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  { timestamps: true }
);

export default models.Note || mongoose.model<Note>('Note', NoteSchema);
