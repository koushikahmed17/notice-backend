import { Router } from 'express';
import {
  createNotice,
  getNoticeById,
  getAllNotices,
  updateNotice,
  updateNoticeStatus,
  deleteNotice,
} from '../controllers/notice.controller';
import { validate } from '../middlewares/validate.middleware';
import {
  createNoticeSchema,
  getNoticeSchema,
  updateNoticeSchema,
  getNoticesSchema,
  updateNoticeStatusSchema,
} from '../schemas/notice.schema';
import { upload } from '../config/upload';

const router = Router();

// Create notice with file upload support
router.post(
  '/',
  upload.array('attachments', 10), // Allow up to 10 files
  validate(createNoticeSchema),
  createNotice
);

// Get all notices with filtering
router.get('/', validate(getNoticesSchema), getAllNotices);

// Get single notice
router.get('/:id', validate(getNoticeSchema), getNoticeById);

// Update notice with file upload support
router.put(
  '/:id',
  upload.array('attachments', 10), // Allow up to 10 files
  validate(updateNoticeSchema),
  updateNotice
);

// Update notice status
router.patch(
  '/:id/status',
  validate(updateNoticeStatusSchema),
  updateNoticeStatus
);

// Delete notice
router.delete('/:id', deleteNotice);

export default router;

