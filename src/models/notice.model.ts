import mongoose, { Schema, Document } from 'mongoose';
import { INotice } from '../interfaces/INotice';

export interface INoticeDocument extends Document, Omit<INotice, '_id'> {
  _id: mongoose.Types.ObjectId;
}

const noticeSchema = new Schema<INoticeDocument>(
  {
    targetDepartmentOrIndividual: {
      type: String,
      required: [true, 'Target department or individual is required'],
      trim: true,
    },
    targetType: {
      type: String,
      enum: ['department', 'individual'],
      required: [true, 'Target type is required'],
    },
    noticeTitle: {
      type: String,
      required: [true, 'Notice title is required'],
      trim: true,
    },
    employeeId: {
      type: String,
      trim: true,
    },
    employeeName: {
      type: String,
      trim: true,
    },
    position: {
      type: String,
      trim: true,
    },
    noticeType: {
      type: String,
      required: [true, 'Notice type is required'],
      trim: true,
    },
    publishDate: {
      type: Date,
      required: [true, 'Publish date is required'],
    },
    noticeBody: {
      type: String,
      required: [true, 'Notice body is required'],
      trim: true,
    },
    attachments: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ['draft', 'published', 'unpublished'],
      default: 'draft',
    },
    createdBy: {
      type: String,
      default: 'system',
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for filtering by status
noticeSchema.index({ status: 1, createdAt: -1 });

export const Notice = mongoose.model<INoticeDocument>('Notice', noticeSchema);
