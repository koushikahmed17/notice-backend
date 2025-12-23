import { Notice } from '../models/notice.model';
import { ApiError } from '../utils/ApiError';
import { CreateNoticeInput, UpdateNoticeInput } from '../schemas/notice.schema';
import { PaginationParams, PaginatedResponse } from '../types/common.types';

export const createNotice = async (
  noticeData: CreateNoticeInput
) => {
  const notice = await Notice.create({
    ...noticeData,
    createdBy: noticeData.createdBy || 'system',
    status: noticeData.status || 'draft',
  });
  return notice;
};

export const getNoticeById = async (id: string) => {
  const notice = await Notice.findById(id);
  if (!notice) {
    throw ApiError.notFound('Notice not found');
  }
  return notice;
};

export const getAllNotices = async (
  params: PaginationParams & {
    status?: 'draft' | 'published' | 'unpublished';
    noticeType?: string;
    targetType?: 'department' | 'individual';
  }
): Promise<PaginatedResponse<any>> => {
  const page = params.page || 1;
  const limit = params.limit || 10;
  const skip = (page - 1) * limit;

  const query: any = {};

  if (params.status) {
    query.status = params.status;
  }

  if (params.noticeType) {
    query.noticeType = params.noticeType;
  }

  if (params.targetType) {
    query.targetType = params.targetType;
  }

  const [notices, total] = await Promise.all([
    Notice.find(query)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Notice.countDocuments(query),
  ]);

  return {
    data: notices,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};

export const updateNotice = async (id: string, updateData: UpdateNoticeInput) => {
  const notice = await Notice.findById(id);
  if (!notice) {
    throw ApiError.notFound('Notice not found');
  }

  Object.assign(notice, updateData);
  await notice.save();
  return notice;
};

export const updateNoticeStatus = async (
  id: string,
  status: 'draft' | 'published' | 'unpublished'
) => {
  const notice = await Notice.findById(id);
  if (!notice) {
    throw ApiError.notFound('Notice not found');
  }

  notice.status = status;
  await notice.save();
  return notice;
};

export const deleteNotice = async (id: string) => {
  const notice = await Notice.findByIdAndDelete(id);
  if (!notice) {
    throw ApiError.notFound('Notice not found');
  }
  return notice;
};

