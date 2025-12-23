export interface INotice {
  _id: string;
  targetDepartmentOrIndividual: string;
  targetType: 'department' | 'individual';
  noticeTitle: string;
  employeeId?: string;
  employeeName?: string;
  position?: string;
  noticeType: string;
  publishDate: Date;
  noticeBody: string;
  attachments?: string[];
  status: 'draft' | 'published' | 'unpublished';
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICreateNotice {
  targetDepartmentOrIndividual: string;
  targetType: 'department' | 'individual';
  noticeTitle: string;
  employeeId?: string;
  employeeName?: string;
  position?: string;
  noticeType: string;
  publishDate: Date;
  noticeBody: string;
  attachments?: string[];
  status?: 'draft' | 'published' | 'unpublished';
  createdBy?: string;
}

export interface IUpdateNotice {
  targetDepartmentOrIndividual?: string;
  targetType?: 'department' | 'individual';
  noticeTitle?: string;
  employeeId?: string;
  employeeName?: string;
  position?: string;
  noticeType?: string;
  publishDate?: Date;
  noticeBody?: string;
  attachments?: string[];
  status?: 'draft' | 'published' | 'unpublished';
}

