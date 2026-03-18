import express from 'express';
import { register, getOrNewKey } from '../controllers/utilisateur.controller.js';

const router = express.Router();

router.post('/users', register);

router.get('/users/cle', getOrNewKey);

export default router;