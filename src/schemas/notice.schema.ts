import { z } from 'zod';

export const createNoticeSchema = z.object({
  body: z.object({
    targetDepartmentOrIndividual: z
      .string()
      .min(1, 'Target department or individual is required')
      .trim(),
    targetType: z.enum(['department', 'individual'], {
      required_error: 'Target type is required',
    }),
    noticeTitle: z.string().min(1, 'Notice title is required').trim(),
    employeeId: z.string().optional(),
    employeeName: z.string().optional(),
    position: z.string().optional(),
    noticeType: z.string().min(1, 'Notice type is required').trim(),
    publishDate: z.union([
      z.string().transform((str) => new Date(str)),
      z.coerce.date(),
    ]).refine((date) => !isNaN(date.getTime()), {
      message: 'Invalid date format',
    }),
    noticeBody: z.string().min(1, 'Notice body is required').trim(),
    attachments: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published', 'unpublished']).optional(),
    createdBy: z.string().optional(),
  }),
});

export const updateNoticeSchema = z.object({
  body: z.object({
    targetDepartmentOrIndividual: z.string().min(1).trim().optional(),
    targetType: z.enum(['department', 'individual']).optional(),
    noticeTitle: z.string().min(1).trim().optional(),
    employeeId: z.string().optional(),
    employeeName: z.string().optional(),
    position: z.string().optional(),
    noticeType: z.string().min(1).trim().optional(),
    publishDate: z.union([
      z.string().transform((str) => new Date(str)),
      z.coerce.date(),
    ]).optional(),
    noticeBody: z.string().min(1).trim().optional(),
    attachments: z.array(z.string()).optional(),
    status: z.enum(['draft', 'published', 'unpublished']).optional(),
  }),
  params: z.object({
    id: z.string().min(1, 'Notice ID is required'),
  }),
});

export const getNoticeSchema = z.object({
  params: z.object({
    id: z.string().min(1, 'Notice ID is required'),
  }),
});

export const getNoticesSchema = z.object({
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1)),
    limit: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 10)),
    status: z.enum(['draft', 'published', 'unpublished']).optional(),
    noticeType: z.string().optional(),
    targetType: z.enum(['department', 'individual']).optional(),
  }),
});

export const updateNoticeStatusSchema = z.object({
  body: z.object({
    status: z.enum(['draft', 'published', 'unpublished'], {
      required_error: 'Status is required',
    }),
  }),
  params: z.object({
    id: z.string().min(1, 'Notice ID is required'),
  }),
});

export type CreateNoticeInput = z.infer<typeof createNoticeSchema>['body'];
export type UpdateNoticeInput = z.infer<typeof updateNoticeSchema>['body'];
export type UpdateNoticeStatusInput = z.infer<typeof updateNoticeStatusSchema>['body'];

