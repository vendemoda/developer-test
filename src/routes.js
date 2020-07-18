import express from "express";

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';

import authMiddleware from './app/middlewares/auth';

import multer from 'multer';
import multerConfig from './config/multer';

const router = express();
const upload = new multer(multerConfig);


//Route to register a new user
router.post('/users', UserController.store);

//Route to login
router.post('/sessions', SessionController.store);

/* From here you need authentication to access the route */
router.use(authMiddleware);

/* Refering to Users */
router.put('/users', UserController.update);
router.delete('/users', UserController.destroy);


export default router;
