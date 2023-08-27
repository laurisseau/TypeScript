"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decode = exports.generateTokenForEmail = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
const default_1 = require("./config/default");
const jwtUserSecret = default_1.default.JWT_USER_SECRET;
const generateTokenForEmail = (user) => {
    return jsonwebtoken_1.default.sign({
        email: user.email,
    }, jwtUserSecret, {
        expiresIn: '30d',
    });
};
exports.generateTokenForEmail = generateTokenForEmail;
const decode = (emailToken) => {
    const decoded = jsonwebtoken_1.default.verify(emailToken, jwtUserSecret);
    return decoded;
};
exports.decode = decode;
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
