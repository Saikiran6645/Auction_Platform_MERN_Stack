import express from 'express';
import { register,login, getProfile,logout, leaderboard } from '../controllers/userController.js';
import { isAuthenticated } from '../middlewares/authentication.js';
const router=express.Router();


router.post("/register",register);
router.post("/login",login);
router.get("/me",isAuthenticated,getProfile);
router.get("/leaderboard",isAuthenticated,leaderboard);
router.get("/logout",isAuthenticated,logout);
export default router;