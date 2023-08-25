import { login, signup,  } from '../controller/user';
import express from 'express';

const userRouter = express.Router();

userRouter.post('/login', login);

userRouter.post('/signUp', signup);

export default userRouter;