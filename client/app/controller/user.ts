import {
  CognitoUserPool,
  CognitoUserAttribute,
} from 'amazon-cognito-identity-js';
import expressAsyncHandler from 'express-async-handler';
import { generateTokenForEmail, decode } from '../utils';
import pkg from 'aws-sdk';
import { CognitoJwtVerifier } from 'aws-jwt-verify';
import config from '../config/default';
import { Request, Response } from 'express';
import { InitiateAuthRequest } from 'aws-sdk/clients/cognitoidentityserviceprovider';

const { CognitoIdentityServiceProvider } = pkg;

const userPoolId: string = config.USER_POOL_ID;
const clientId: string = config.CLIENT_ID;

interface AwsPoolData {
  UserPoolId: string;
  ClientId: string;
}

const poolData: AwsPoolData = {
  UserPoolId: userPoolId,
  ClientId: clientId,
};

const userPool = new CognitoUserPool(poolData);

const cognito = new CognitoIdentityServiceProvider({ region: 'us-east-1' });

export const signup = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const emailToken = generateTokenForEmail({ email: req.body.email });

    const attributeList: CognitoUserAttribute[] = [];

    interface dataEmailType {
      Name: string;
      Value: string;
    }

    const dataEmail: dataEmailType = {
      Name: 'email',
      Value: req.body.email, // Replace with the user's email
    };

    interface dataUsernameType {
      Name: string;
      Value: string;
    }

    const dataUsername: dataUsernameType = {
      Name: 'preferred_username',
      Value: req.body.username, // Replace with the user's username
    };

    interface dataWebsiteType {
      Name: string;
      Value: string;
    }

    const dataWebsite: dataWebsiteType = {
      Name: 'custom:website',
      Value: `${req.protocol}://${req.get('x-forwarded-host')}`,
    };

    interface dataLinkType {
      Name: string;
      Value: string;
    }

    const dataLink: dataLinkType = {
      Name: 'custom:link',
      Value: `${req.protocol}://${req.get(
        'x-forwarded-host'
      )}/signup/otp/${emailToken}`,
    };

    interface dataRoleType {
      Name: string;
      Value: string;
    }

    const dataRole: dataRoleType = {
      Name: 'custom:role',
      Value: 'user',
    };

    const attributeEmail = new CognitoUserAttribute(dataEmail);
    const attributeUsername = new CognitoUserAttribute(dataUsername);
    const attributeLink = new CognitoUserAttribute(dataLink);
    const attributeRole = new CognitoUserAttribute(dataRole);
    const attributeWebsite = new CognitoUserAttribute(dataWebsite);

    attributeList.push(attributeEmail);
    attributeList.push(attributeUsername);
    attributeList.push(attributeLink);
    attributeList.push(attributeRole);
    attributeList.push(attributeWebsite);

    userPool.signUp(
      req.body.email,
      req.body.password,
      attributeList,
      [],
      (err, result) => {
        if (err) {
          res.send(err);
          return;
        }

        if (result) {
          const cognitoUser = result.user;
          const user = cognitoUser.getUsername();

          res.send({
            email: user,
            url: `${req.protocol}://${req.get(
              'x-forwarded-host'
            )}/otp/${emailToken}`,
            token: emailToken,
          });
        }
      }
    );
  }
);

export const decodeJwtToVerify = expressAsyncHandler(
  async (req: Request, res: Response) => {
    const decoded = decode(req.params.id);

    res.send(decoded);
  }
);

export const emailVerification = expressAsyncHandler(
  async (req: Request, res: Response) => {
    interface paramsDataType {
      ConfirmationCode: string;
      Username: string;
      ClientId: string;
    }

    const params: paramsDataType = {
      ConfirmationCode: req.body.code,
      Username: req.body.username,
      ClientId: clientId,
    };

    await cognito.confirmSignUp(params).promise();
    res.send('User email confirmed successfully.');
  }
);

export const login = expressAsyncHandler(
  async (req: Request, res: Response) => {
    // Import the correct type

    const params: InitiateAuthRequest = {
      AuthFlow: 'USER_PASSWORD_AUTH',
      ClientId: clientId, // Make sure clientId is defined
      AuthParameters: {
        USERNAME: req.body.username, // Make sure req.body.username is defined
        PASSWORD: req.body.password, // Make sure req.body.password is defined
      },
    };

    try {
      const data = await cognito.initiateAuth(params).promise();

      if (data.AuthenticationResult) {
        const idToken = data.AuthenticationResult.IdToken;
        const accessToken = data.AuthenticationResult.AccessToken;

        const verifier = CognitoJwtVerifier.create({
          userPoolId: userPoolId,
          tokenUse: 'id',
          clientId: clientId,
        });

        if (idToken) {
          const payload = await verifier.verify(idToken);

          interface responsePayloadDataType {
            ['preferred_username']: string;
            ['custom:role']: string;
            sub: string;
            email: string;
            token: string;
            accessToken: string;
          }

          const responsePayload: responsePayloadDataType = {
            ['preferred_username']: payload['preferred_username'] as string,
            ['custom:role']: payload['custom:role'] as string,
            sub: payload.sub,
            email: payload.email as string,
            token: idToken,
            accessToken: accessToken as string,
          };

          res.send(responsePayload);
        }
      }
    } catch (err) {
      res.send('Wrong username or password.');
    }
  }
);
