import express from 'express';
import AuthController from '../controllers/AuthController';
import AppController from '../controllers/AppController';
import UsersController from '../controllers/UsersController';
import FilesController from '../controllers/FilesController';

const router = express.Router();

// AppController end points
router.get('/status', AppController.getStatus);
router.get('/stats', AppController.getStats);

// AuthController endpoints
router.get('/connect', AuthController.getConnect);
router.get('/disconnect', AuthController.getDisconnect);

// UsersController endpoint
router.post('/users', UsersController.postNew);

// UserController endpoints
router.get('/users/me', UsersController.getMe);

// Files controller
router.post('/files', FilesController.postUpload);
export default router;
