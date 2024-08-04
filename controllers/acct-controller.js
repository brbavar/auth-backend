import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import { v4 as uuid } from 'uuid';
import { sendEmail } from '../util/sendEmail.js';

import {
  cache,
  storeUserData,
  getUserData,
  changeUserData,
  scan,
} from '../models/acct-model.js';

dotenv.config();

const createAcct = async (req, res) => {
  const resToGetUserData = await getUserData(req.body);
  // let resToStoreUserData;
  let userData = resToGetUserData.Item;
  if (userData) {
    res.sendStatus(400);
  } else {
    const verificationString = uuid();
    req.body.VerificationString = verificationString;

    // resToStoreUserData = await storeUserData(req.body);
    storeUserData(req.body);

    sendEmail({
      to: req.body.Email,
      from: 'segundah.usah@gmail.com',
      subject: "Let's verify your email",
      text: `Welcome aboard! To verify your email, click here: ${req.get(
        'origin'
      )}/verify-email/${verificationString}`,
    }).catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });

    jwt.sign(
      {
        Email: req.body.Email,
        IsVerified: false,
      },
      process.env.JWT_SECRET,
      { expiresIn: '2d' },
      (err, token) => {
        if (err) return res.status(500).send(err);
        res.status(200).json({ token });
      }
    );
  }
};

const askToScan = async (req, res) => {
  let expressionAttributeNames;

  switch (req.originalUrl) {
    case '/names-of-users':
      expressionAttributeNames = { '#FN': 'First name', '#LN': 'Last name' };
      break;
  }

  const exprs = Object.keys(expressionAttributeNames);

  let projectionExpression = '';
  let i;
  for (i = 0; i < exprs.length - 1; i++)
    projectionExpression += `${exprs[i]}, `;
  projectionExpression += exprs[i];

  const data = await scan(projectionExpression, expressionAttributeNames);

  return res.send(data);
};

const verifyEmail = async (req, res) => {
  const { VerificationString } = req.body;

  const projectionExpression = 'Email';
  const expressionAttributeValues = { ':v': req.body.VerificationString };
  const filterExpression = 'VerificationString = :v';
  const key = { Email: req.body.Email };

  const resToScan = await scan(
    projectionExpression,
    null,
    expressionAttributeValues,
    filterExpression,
    key
  );
  if (!resToScan.Count)
    return res
      .status(401)
      .json({ message: 'The email verification code is incorrect.' });

  const email = resToScan.Items[0].Email;
  req.body.Email = email;

  req.body.AttributeName = 'IsVerified';
  // req.body.AttributeType = 'BOOL';
  req.body.IsVerified = true;

  changeUserData(req.body);
  jwt.sign(
    { Email: email, IsVerified: true },
    process.env.JWT_SECRET,
    { expiresIn: '2d' },
    (err, token) => {
      if (err) return res.sendStatus(500);
      res.status(200).json({ token });
    }
  );
};

const logIn = async (req, res) => {
  const resToGetUserData = await getUserData(req.params);
  const userData = resToGetUserData.Item;

  //   if (userData) res.send(userData['First name'].S);
  if (!userData && resToGetUserData.status !== 304) return res.sendStatus(401);

  //   if (resToGetUserData.status == 304)
  //     res.send(JSON.stringify(cache[req.params.Email]));

  const passwordRight = await bcrypt.compare(
    req.params.Password,
    userData ? userData.Password : cache[req.params.Email].Password
  );

  if (!passwordRight) return res.sendStatus(401);

  jwt.sign(
    {
      Email: req.params.Email,
      IsVerified: false,
    },
    process.env.JWT_SECRET,
    { expiresIn: '2d' },
    (err, token) => {
      if (err) return res.status(500).json(err);
      res.status(200).json({
        Token: token,
        FirstName: userData['First name'],
        LastName: userData['Last name'],
      });
    }
  );
};

const sendPasswordResetEmail = async (req, res) => {
  const resToGetUserData = await getUserData(req.params);
  const userData = resToGetUserData.Item;

  if (userData) {
    sendEmail({
      to: userData.Email,
      from: { email: 'segundah.usah@gmail.com', name: 'Authogonal' },
      subject: 'Choose a new password',
      text: `To reset your password, click here: ${req.get(
        'origin'
      )}/password-reset/${userData.VerificationString}`,
    }).catch((e) => {
      console.log(e);
      res.sendStatus(500);
      return;
    });
    res.sendStatus(200);
  } else res.sendStatus(400);
};

const getPassword = async (req, res) => {
  const resToGetUserData = await getUserData(req.params);
  const userData = resToGetUserData.Item;

  const passwordRight = await bcrypt.compare(
    req.params.CurrentPassword,
    userData
      ? userData.Password
      : req.params.Email
      ? cache[req.params.Email].Password
      : ''
  );

  if (!passwordRight) return res.sendStatus(401);

  return res.sendStatus(200);
};

const resetPassword = async (req, res) => {
  req.body.AttributeName = 'Password';
  req.body.Password = await bcrypt.hash(req.body['New password'], 10);
  changeUserData(req.body);
  return res.sendStatus(200);
};

export {
  createAcct,
  askToScan,
  verifyEmail,
  logIn,
  sendPasswordResetEmail,
  getPassword,
  resetPassword,
};
