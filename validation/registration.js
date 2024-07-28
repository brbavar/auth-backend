import { body } from 'express-validator';

const validateRegistration = [
  body('Email').isEmail().withMessage('This is not a valid email address'),
  body('Password')
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password needs to be 6 or more characters long'),
  body('First name')
    .trim()
    .notEmpty()
    .optional()
    .withMessage(
      'First name should not be left empty, unless user intends to opt out of providing a first name'
    ),
  body('Last name')
    .trim()
    .notEmpty()
    .optional()
    .withMessage(
      'Last name should not be left empty, unless user intends to opt out of providing a last name'
    ),
];

const confirmMatch = (val, { req }) => {
  if (val !== req.body['Confirm password'])
    throw new Error('Passwords do not match');
  else return val;
};

export { validateRegistration, confirmMatch };
