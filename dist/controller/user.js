"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = exports.emailVerification = exports.decodeJwtToVerify = exports.signup = void 0;
const amazon_cognito_identity_js_1 = require("amazon-cognito-identity-js");
const express_async_handler_1 = require("express-async-handler");
const utils_1 = require("../utils");
const aws_sdk_1 = require("aws-sdk");
const aws_jwt_verify_1 = require("aws-jwt-verify");
const default_1 = require("../config/default");
const { CognitoIdentityServiceProvider } = aws_sdk_1;
const userPoolId = default_1.default.USER_POOL_ID;
const clientId = default_1.default.CLIENT_ID;
const poolData = {
    UserPoolId: userPoolId,
    ClientId: clientId,
};
const userPool = new amazon_cognito_identity_js_1.CognitoUserPool(poolData);
const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });
exports.signup = (0, express_async_handler_1)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const emailToken = (0, utils_1.generateTokenForEmail)({ email: req.body.email });
    const origin = req.get('Origin');
    const attributeList = [];
    const dataEmail = {
        Name: 'email',
        Value: req.body.email, // Replace with the user's email
    };
    const dataUsername = {
        Name: 'preferred_username',
        Value: req.body.username, // Replace with the user's username
    };
    const dataWebsite = {
        Name: 'custom:website',
        Value: `${req.protocol}://${req.get('x-forwarded-host')}`,
    };
    const dataLink = {
        Name: 'custom:link',
        Value: `${origin}/otp/${emailToken}`,
    };
    const dataRole = {
        Name: 'custom:role',
        Value: 'user',
    };
    const attributeEmail = new amazon_cognito_identity_js_1.CognitoUserAttribute(dataEmail);
    const attributeUsername = new amazon_cognito_identity_js_1.CognitoUserAttribute(dataUsername);
    const attributeLink = new amazon_cognito_identity_js_1.CognitoUserAttribute(dataLink);
    const attributeRole = new amazon_cognito_identity_js_1.CognitoUserAttribute(dataRole);
    const attributeWebsite = new amazon_cognito_identity_js_1.CognitoUserAttribute(dataWebsite);
    attributeList.push(attributeEmail);
    attributeList.push(attributeUsername);
    attributeList.push(attributeLink);
    attributeList.push(attributeRole);
    attributeList.push(attributeWebsite);
    userPool.signUp(req.body.email, req.body.password, attributeList, [], (err, result) => {
        if (err) {
            res.send(err);
            return;
        }
        if (result) {
            const cognitoUser = result.user;
            const user = cognitoUser.getUsername();
            res.send({
                email: user,
                url: `${origin}/otp/${emailToken}`,
                token: emailToken,
            });
        }
    });
}));
exports.decodeJwtToVerify = (0, express_async_handler_1)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const decoded = (0, utils_1.decode)(req.params.id);
    res.send(decoded);
}));
exports.emailVerification = (0, express_async_handler_1)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        ConfirmationCode: req.body.code,
        Username: req.body.username,
        ClientId: clientId,
    };
    yield cognito.confirmSignUp(params).promise();
    res.send('User email confirmed successfully.');
}));
exports.login = (0, express_async_handler_1)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const params = {
        AuthFlow: 'USER_PASSWORD_AUTH',
        ClientId: clientId,
        AuthParameters: {
            USERNAME: req.body.username,
            PASSWORD: req.body.password, // Make sure req.body.password is defined
        },
    };
    try {
        const data = yield cognito.initiateAuth(params).promise();
        if (data.AuthenticationResult) {
            const idToken = data.AuthenticationResult.IdToken;
            const accessToken = data.AuthenticationResult.AccessToken;
            const verifier = aws_jwt_verify_1.CognitoJwtVerifier.create({
                userPoolId: userPoolId,
                tokenUse: 'id',
                clientId: clientId,
            });
            if (idToken) {
                const payload = yield verifier.verify(idToken);
                const responsePayload = {
                    ['preferred_username']: payload['preferred_username'],
                    ['custom:role']: payload['custom:role'],
                    sub: payload.sub,
                    email: payload.email,
                    token: idToken,
                    accessToken: accessToken,
                    success: 'success',
                };
                res.send(responsePayload);
            }
        }
    }
    catch (err) {
        res.status(500).send('Wrong username or password.');
    }
}));
