import { body } from 'express-validator';

const registrationValidationChains = [
  body('Email').isEmail().withMessage('This is not a valid email address'),
  body('First name')
    .trim()
    .notEmpty()
    .withMessage('First name must not be left empty'),
  body('Last name')
    .trim()
    .notEmpty()
    .withMessage('Last name must not be left empty'),
];

const passwordValidationChain = (isNewAcct) =>
  body(`${isNewAcct ? 'P' : 'New p'}assword`)
    .trim()
    .isLength({ min: 6 })
    .withMessage('Password needs to be 6 or more characters long');

const validate = (isNewAcct) => {
  const validationChains = [passwordValidationChain(isNewAcct)];

  if (isNewAcct) validationChains.push(...registrationValidationChains);

  return validationChains;
};

export { validate };
