import jwt from 'jsonwebtoken';
import expressAsyncHandler from 'express-async-handler';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import config from './config/default';

const jwtUserSecret: string = config.JWT_USER_SECRET;

interface emailObj {
  email: string;
}

export const generateTokenForEmail = (user: emailObj) => {
  return jwt.sign(
    {
      email: user.email,
    },
    jwtUserSecret,
    {
      expiresIn: '30d',
    }
  );
};

export const decode = (emailToken: string) => {
  const decoded = jwt.verify(emailToken, jwtUserSecret);

  return decoded;
};

/*
export const isAuth = expressAsyncHandler(async (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    const verifier = CognitoJwtVerifier.create({
      userPoolId: process.env.USER_POOL_ID,
      tokenUse: 'id',
      clientId: process.env.CLIENT_ID,
    });

    req.user = await verifier.verify(token);

    next();
  }
});
*/
