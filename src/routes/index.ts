import { Router } from 'express';
import noticeRoutes from './notice.routes';

const router = Router();

router.use('/notices', noticeRoutes);

export default router;


