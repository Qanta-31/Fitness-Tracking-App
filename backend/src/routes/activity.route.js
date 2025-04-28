import express from 'express';
import { protectRoute } from '../middleware/auth.middleware.js';
import { createActivity, getUserActivities } from '../controllers/activity.controller.js';

const router = express.Router();

router.post('/', protectRoute, createActivity); // Save a new activity
router.get('/', protectRoute, getUserActivities); // Get all activities for logged-in user

export default router;
