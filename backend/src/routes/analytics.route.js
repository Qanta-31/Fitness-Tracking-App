import express from 'express';
import { getUserAnalytics } from '../controllers/analytics.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/', protectRoute, getUserAnalytics);

export default router;
