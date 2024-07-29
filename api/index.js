import dotenv from 'dotenv';

import express from 'express';
import cors from 'cors';

import { check } from 'express-validator';
import { validateRegistration } from '../validation/validateRegistration.js';
import { validateNewPassword } from '../validation/validateNewPassword.js';
import { confirmMatch } from '../validation/confirmMatch.js';
import { getValidationErr } from '../validation/getValidationErr.js';

import {
  createAcct,
  askToScan,
  verifyEmail,
  logIn,
  sendPasswordResetEmail,
  getPassword,
  resetPassword,
} from '../controllers/acct-controller.js';

dotenv.config();

const app = express();

app.use(express.json());

const readPaths = [
  '/names-of-users',
  '/emails/:Email/passwords/:Password',
  '/check-if-reset-sendable/:Email',
  '/get-password/:Email/:CurrentPassword',
];

const readHandlers = [askToScan, logIn, sendPasswordResetEmail, getPassword];

for (let i = 0; i < readPaths.length; i++)
  app.get(readPaths[i], cors(), readHandlers[i]);

const writePaths = ['/register', '/verify-email', '/reset-password'];

const writeTypes = [0, 1, 1];

const writeHandlers = [
  [
    validateRegistration,
    check('Password').custom(confirmMatch),
    getValidationErr,
    createAcct,
  ],
  [verifyEmail],
  [
    validateNewPassword,
    check('New password').custom(confirmMatch),
    getValidationErr,
    resetPassword,
  ],
];

const corsFriendlyWrite = (path, writeType, handlers, application = app) => {
  application.options(path, cors());
  if (writeType === 'post') application.post(path, cors(), ...handlers);
  else application.put(path, cors(), ...handlers);
};

for (let i = 0; i < writePaths.length; i++)
  corsFriendlyWrite(
    writePaths[i],
    writeTypes[i] ? 'put' : 'post',
    writeHandlers[i]
  );

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port ${port}`);
});
