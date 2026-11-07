import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validateBody } from '../../middleware/validate';
import {
  registerSchema,
  loginSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from '@kalyanaconnect/shared';
import { authenticateJwt } from '../../middleware/auth';
import { authLimiter } from '../../middleware/rateLimiter';
import { csrfProtection } from '../../middleware/csrf';

const router = Router();

router.post('/register', authLimiter, validateBody(registerSchema), AuthController.register);
router.post('/login', authLimiter, validateBody(loginSchema), AuthController.login);
router.post('/refresh', csrfProtection, AuthController.refresh);
router.post('/logout', csrfProtection, AuthController.logout);
router.get('/me', authenticateJwt, AuthController.getMe);
router.post('/forgot-password', authLimiter, validateBody(forgotPasswordSchema), AuthController.forgotPassword);
router.post('/reset-password', authLimiter, validateBody(resetPasswordSchema), AuthController.resetPassword);
router.post('/verify-email', validateBody(verifyEmailSchema), AuthController.verifyEmail);

export const authRouter = router;
