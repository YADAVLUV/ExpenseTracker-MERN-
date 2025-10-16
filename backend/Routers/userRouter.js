import express from 'express';
import { loginControllers, registerControllers, setAvatarController, forgetpassword,resetpassword } from '../controllers/userController.js';

const router = express.Router();

router.route("/register").post(registerControllers);

router.route("/login").post(loginControllers);

router.route("/setAvatar/:id").post(setAvatarController);

router.route("/forgotPassword").post(forgetpassword);

router.route("/resetpassword/:token").post(resetpassword);

// Redirect GET reset link hits to frontend reset page
router.get('/resetpassword/:token', (req, res) => {
  const { token } = req.params;
  const frontendBase = process.env.FRONTEND_URL || 'http://localhost:3001';
  const target = `${frontendBase}/resetpassword/${token}`;
  return res.redirect(302, target);
});


export default router;