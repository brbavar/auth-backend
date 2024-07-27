const confirmMatch = (val, { req }) => {
  if (val !== req.body['Confirm password'])
    throw new Error('Passwords do not match');
  else return val;
};

export { confirmMatch };
