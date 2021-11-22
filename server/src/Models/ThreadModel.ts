import mongoose from 'mongoose';

export interface CommentType {
  _id: mongoose.ObjectId;
  user_id: mongoose.ObjectId;
  username: string;
  body: string;
  date: Date;
}

export interface ThreadType {
  title: string;
  date: Date;
  comments: CommentType[];
}

const CommentSchema = new mongoose.Schema<CommentType>({
  _id: {
    type: mongoose.Schema.Types.ObjectId,
    default: function () { return new mongoose.Types.ObjectId(); }
  },
  user_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  username: { type: String, required: true },
  body: { type: String, required: true },
  date: { type: Date, default: new Date() }
});

const ThreadSchema = new mongoose.Schema<ThreadType>({
  title: { type: String, required: true },
  date: { type: Date, default: new Date() },
  comments: [CommentSchema],
});

export const Thread = mongoose.model<ThreadType>('Thread', ThreadSchema, 'threads');
