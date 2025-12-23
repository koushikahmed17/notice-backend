import { Request, Response } from 'express';
import { asyncHandler } from '../utils/asyncHandler';
import { ApiResponse } from '../utils/ApiResponse';
import * as noticeService from '../services/notice.service';
import { MESSAGES } from '../constants/messages';
import { HTTP_STATUS } from '../constants/httpStatus';
import { getFileUrl } from '../config/upload';

export const createNotice = asyncHandler(
  async (req: Request, res: Response) => {
    // Handle file uploads
    const fileUrls: string[] = [];
    const files = req.files as Express.Multer.File[] | undefined;
    if (files && Array.isArray(files) && files.length > 0) {
      fileUrls.push(...files.map((file) => getFileUrl(file.filename)));
    }

    // Parse form-data fields (they come as strings)
    const noticeData = {
      ...req.body,
      publishDate: req.body.publishDate ? new Date(req.body.publishDate) : new Date(),
      attachments: fileUrls.length > 0 ? fileUrls : undefined,
      status: req.body.status || 'draft',
    };

    const notice = await noticeService.createNotice(noticeData);
    ApiResponse.success(
      res,
      notice,
      MESSAGES.SUCCESS.CREATED,
      HTTP_STATUS.CREATED
    );
  }
);

export const getNoticeById = asyncHandler(
  async (req: Request, res: Response) => {
    const notice = await noticeService.getNoticeById(req.params.id);
    ApiResponse.success(res, notice, MESSAGES.SUCCESS.RETRIEVED, HTTP_STATUS.OK);
  }
);

export const getAllNotices = asyncHandler(
  async (req: Request, res: Response) => {
    const result = await noticeService.getAllNotices({
      page: parseInt(req.query.page as string) || 1,
      limit: parseInt(req.query.limit as string) || 10,
      status: req.query.status as 'draft' | 'published' | 'unpublished' | undefined,
      noticeType: req.query.noticeType as string | undefined,
      targetType: req.query.targetType as 'department' | 'individual' | undefined,
    });
    ApiResponse.success(res, result, MESSAGES.SUCCESS.RETRIEVED, HTTP_STATUS.OK);
  }
);

export const updateNotice = asyncHandler(
  async (req: Request, res: Response) => {
    // Handle file uploads
    const fileUrls: string[] = [];
    const files = req.files as Express.Multer.File[] | undefined;
    if (files && Array.isArray(files) && files.length > 0) {
      fileUrls.push(...files.map((file) => getFileUrl(file.filename)));
    }

    // Parse form-data fields
    const updateData: any = { ...req.body };
    
    if (req.body.publishDate) {
      updateData.publishDate = new Date(req.body.publishDate);
    }
    
    if (fileUrls.length > 0) {
      // If new files are uploaded, replace existing attachments
      updateData.attachments = fileUrls;
    }

    const notice = await noticeService.updateNotice(req.params.id, updateData);
    ApiResponse.success(res, notice, MESSAGES.SUCCESS.UPDATED, HTTP_STATUS.OK);
  }
);

export const updateNoticeStatus = asyncHandler(
  async (req: Request, res: Response) => {
    const notice = await noticeService.updateNoticeStatus(
      req.params.id,
      req.body.status
    );
    ApiResponse.success(
      res,
      notice,
      'Notice status updated successfully',
      HTTP_STATUS.OK
    );
  }
);

export const deleteNotice = asyncHandler(
  async (req: Request, res: Response) => {
    await noticeService.deleteNotice(req.params.id);
    ApiResponse.success(
      res,
      null,
      MESSAGES.SUCCESS.DELETED,
      HTTP_STATUS.NO_CONTENT
    );
  }
);

