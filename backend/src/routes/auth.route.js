import express from 'express'
import { signup, login, logout, getProfile, checkAuth, getSignInDate } from '../controllers/auth.controller.js';
import { protectRoute } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get("/api/user/signin-date", protectRoute, getSignInDate);

// this is to check if the user is authorized or not --> example --> if the user is on profile page and he refreshes the page then we will first check if the user is authorized or not if yes then go to profile otherwise go to login
router.get("/check",protectRoute, checkAuth);

router.post("/signup", signup);

router.post("/login", login);

router.post("/logout", logout);

router.get('/profile', protectRoute, getProfile);





export default router;