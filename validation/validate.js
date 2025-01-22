import { body } from 'express-validator';

const registrationValidationChains = [
  body('Email').isEmail().withMessage('This is not a valid email address'),
  body('First name')
    .trim()
    .notEmpty()
    .optional()
    .withMessage(
      'First name should not be left empty, unless you want to opt out of providing a first name'
    ),
  body('Last name')
    .trim()
    .notEmpty()
    .optional()
    .withMessage(
      'Last name should not be left empty, unless you want to opt out of providing a last name'
    ),
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
