import { Router } from 'express';
import { register, login, verifyToken, logout, profile } from '../controllers/auth2.controller.js';

//import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.post('/v2/register', register);
router.post('/v2/login', login);
router.get('/v2/verify', verifyToken);
router.get('/v2/profile', profile);
router.post('/v2/logout', logout);

//router.get('/v2/profile', authRequired, profile);


export default router;

