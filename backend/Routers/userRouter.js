import express from 'express';
import { loginControllers, registerControllers, setAvatarController, forgetpassword,resetpassword } from '../controllers/userController.js';

const router = express.Router();

router.route("/register").post(registerControllers);

router.route("/login").post(loginControllers);

router.route("/setAvatar/:id").post(setAvatarController);

router.route("/forgetpassword").post(forgetpassword);

router.route("/resetpassword").post(resetpassword);

export default router;