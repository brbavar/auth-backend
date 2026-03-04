import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { snakeToPascal } from '../util/snakeToPascal';
import { Client } from 'pg';

// import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
// import {
//   GetCommand,
//   ScanCommand,
//   PutCommand,
//   UpdateCommand,
//   DynamoDBDocumentClient,
// } from '@aws-sdk/lib-dynamodb';

dotenv.config();

// const dynamoClient = new DynamoDBClient({
//   credentials: {
//     accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
//     secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
//   },
//   region: 'us-east-2',
// });
// const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);
const client = new Client({
  host: '132.145.96.91', // Oracle Cloud VM's public IP
  port: 5432, // default PostgreSQL port
  user: 'ubuntu',
  password: '7yqZYlLIaf',
  database: 'authdb',
});

const cache = {};
// let dynamoInput = { TableName: 'accts' };

const storeUserData = async (reqPayload) => {
  cache[reqPayload.Email] = reqPayload;

  await client.connect();

  // let key = { Email: reqPayload.Email };
  // dynamoInput.Item = key;

  const encryptedPassword = await bcrypt.hash(reqPayload.Password, 10);
  // dynamoInput.Item.Password = encryptedPassword;

  // dynamoInput.Item.IsVerified = false;
  // dynamoInput.Item.VerificationString = reqPayload.VerificationString;

  await client.query(
    `INSERT INTO users (email, first_name, last_name, password, verification_string, is_verified) VALUES (${reqPayload.Email}, ${reqPayload['First name']}, ${reqPayload['Last name']}, ${encryptedPassword}, ${reqPayload.VerificationString}, FALSE);`,
  );

  // for (let key of Object.keys(reqPayload))
  //   if (
  //     // !Object.keys(dynamoInput.Item).includes(key) &&
  //     !['Password', 'Create account', 'Confirm password'].includes(key)
  //   ) {
  //     // dynamoInput.Item[key] = reqPayload[key];
  //     await client.query(
  //       `INSERT INTO users (${key}) VALUES (${encryptedPassword});`,
  //     );
  //   }

  // return dynamoDocClient.send(new PutCommand(dynamoInput));

  await client.end();
};

const getUserData = async (reqPayload) => {
  /* let key = { Email: reqPayload.Email };
  dynamoInput.Key = key;

  return dynamoDocClient.send(new GetCommand(dynamoInput)); */

  await client.connect();

  await client.query(`SELECT * FROM users WHERE email = ${reqPayload.Email};`);

  await client.end();
};

const changeUserData = async (reqPayload) => {
  /* const key = { Email: reqPayload.Email };
  dynamoInput.Key = key;
  const attr = reqPayload.AttributeName;

  dynamoInput.ExpressionAttributeValues = { ':v': `${reqPayload[attr]}` };
  dynamoInput.UpdateExpression = `SET ${attr} = :v`;

  return dynamoDocClient.send(new UpdateCommand(dynamoInput)); */

  // const attrNameOnForm = reqPayload.attributeName;
  // const attrVal = reqPayload[attrNameOnForm];

  // let columnName = '';

  // switch (attrNameOnForm) {
  //   case 'Email':
  //     columnName = 'email';
  //     break;
  //   case 'First name':
  //     columnName = 'first_name';
  //     break;
  //   case 'Last name':
  //     columnName = 'last_name';
  //     break;
  //   case 'Password':
  //     columnName = 'password';
  //     break;
  //   case 'VerificationString':
  //     columnName = 'verification_string';
  //     break;
  //   case 'IsVerified':
  //     columnName = 'is_verified';
  //     break;
  //   // else
  //   default:
  //     break;
  // }

  const col = reqPayload.ColumnName;

  await client.connect();

  await client.query(
    `UPDATE users SET ${col} = ${reqPayload[`${snakeToPascal(col)}`]} WHERE email = ${reqPayload.Email};`,
  );

  await client.end();
};

const scan = async (
  proj = '',
  attrNames = null,
  attrVals = null,
  filt = '',
  key = null,
) => {
  /* if (key) dynamoInput.Key = key;

  if (attrNames) dynamoInput.ExpressionAttributeNames = attrNames;
  if (attrVals) dynamoInput.ExpressionAttributeValues = attrVals;
  if (filt) dynamoInput.FilterExpression = filt;
  if (proj) dynamoInput.ProjectionExpression = proj;

  return dynamoDocClient.send(new ScanCommand(dynamoInput)); */

  await client.connect();

  await client.query(`SELECT * FROM users WHERE ;`);

  await client.end();
};

export { cache, storeUserData, getUserData, changeUserData, scan };
