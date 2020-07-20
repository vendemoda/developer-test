import express from "express";

import UserController from './app/controllers/UserController';
import SessionController from './app/controllers/SessionController';
import ProductController from './app/controllers/ProductController';
import FileController from './app/controllers/FileController';

import authMiddleware from './app/middlewares/auth';

import multer from 'multer';
import multerConfig from './config/multer';

const router = express();
const upload = new multer(multerConfig);


/* Route to register a new user */
router.post('/users', UserController.store);

/* Route to login */
router.post('/sessions', SessionController.store);

/* Refering to Products */
router.get('/products', ProductController.index); //List
router.get('/products/:productId', ProductController.show); //Detail


/* From here you need authentication to access the route */
router.use(authMiddleware);

/* Route to files upload */
router.post('/products/upload', upload.single('file'), FileController.store);

/* Refering to Users */
router.put('/users', UserController.update);
router.delete('/users', UserController.destroy);

/* Refering to Products */
router.post('/products', ProductController.store); //Create
router.put('/products/:productId', ProductController.update); //Update
router.put('/products/:productId', ProductController.delete); //Soft Delete
router.put('/products/restore/:postId', ProductController.restore); //Restore
router.delete('/products/:productId', ProductController.destroy); //Force Delete


export default router;
