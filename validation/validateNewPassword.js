import { body } from 'express-validator';

const validateNewPassword = [
  body('Password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password needs to be 6 or more characters long'),
];

export { validateNewPassword };
