import dotenv from 'dotenv';
import bcrypt from 'bcrypt';

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import {
  GetCommand,
  ScanCommand,
  PutCommand,
  UpdateCommand,
  DynamoDBDocumentClient,
} from '@aws-sdk/lib-dynamodb';

dotenv.config();

const dynamoClient = new DynamoDBClient({
  credentials: {
    accessKeyId: process.env.MY_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.MY_AWS_SECRET_ACCESS_KEY,
  },
  region: 'us-east-2',
});
const dynamoDocClient = DynamoDBDocumentClient.from(dynamoClient);

const cache = {};
let dynamoInput = { TableName: 'accts' };

const storeUserData = async (reqPayload) => {
  cache[reqPayload.Email] = reqPayload;

  let key = { Email: reqPayload.Email };
  dynamoInput.Item = key;

  const encryptedPassword = await bcrypt.hash(reqPayload.Password, 10);
  dynamoInput.Item.Password = encryptedPassword;

  dynamoInput.Item.IsVerified = false;
  dynamoInput.Item.VerificationString = reqPayload.VerificationString;

  for (let key of Object.keys(reqPayload))
    if (
      !Object.keys(dynamoInput.Item).includes(key) &&
      !['Password', 'Create account', 'Confirm password'].includes(key)
    ) {
      dynamoInput.Item[key] = reqPayload[key];
    }

  return dynamoDocClient.send(new PutCommand(dynamoInput));
};

const getUserData = (reqPayload) => {
  let key = { Email: reqPayload.Email };
  dynamoInput.Key = key;

  return dynamoDocClient.send(new GetCommand(dynamoInput));
};

const changeUserData = (reqPayload) => {
  const key = { Email: reqPayload.Email };
  dynamoInput.Key = key;
  const attr = reqPayload.AttributeName;

  dynamoInput.ExpressionAttributeValues = { ':v': `${reqPayload[attr]}` };
  dynamoInput.UpdateExpression = `SET ${attr} = :v`;

  return dynamoDocClient.send(new UpdateCommand(dynamoInput));
};

const scan = (
  proj = '',
  attrNames = null,
  attrVals = null,
  filt = '',
  key = null
) => {
  if (key) dynamoInput.Key = key;

  if (attrNames) dynamoInput.ExpressionAttributeNames = attrNames;
  if (attrVals) dynamoInput.ExpressionAttributeValues = attrVals;
  if (filt) dynamoInput.FilterExpression = filt;
  if (proj) dynamoInput.ProjectionExpression = proj;

  return dynamoDocClient.send(new ScanCommand(dynamoInput));
};

export { cache, storeUserData, getUserData, changeUserData, scan };
