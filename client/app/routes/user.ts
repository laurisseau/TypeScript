import { login, signup, decodeJwtToVerify, emailVerification } from '../controller/user';
import express from 'express';

const userRouter = express.Router();

userRouter.post('/login', login);

userRouter.post('/signUp', signup);

userRouter.get('/email/:id', decodeJwtToVerify);

userRouter.post('/emailVerification', emailVerification);

export default userRouter;
