import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { snakeToPascal } from '../util/snakeToPascal.js';
import { Client } from 'pg';

dotenv.config();

const client = new Client({
  host: '127.0.0.1', // loopback IP, or localhost
  port: 5432, // default PostgreSQL port
  user: 'ubuntu',
  password: '7yqZYlLIaf',
  database: 'authdb',
});

const cache = {};

const storeUserData = async (reqPayload) => {
  cache[reqPayload.Email] = reqPayload;

  await client.connect();

  const encryptedPassword = await bcrypt.hash(reqPayload.Password, 10);

  await client.query(
    `INSERT INTO users (email, first_name, last_name, password, verification_string, is_verified) VALUES ('${reqPayload.Email}', '${reqPayload['First name']}', '${reqPayload['Last name']}', '${encryptedPassword}', '${reqPayload.VerificationString}', FALSE);`,
  );

  await client.end();
};

const getUserData = async (reqPayload) => {
  const condition = reqPayload.Condition || '1 = 1';

  console.log(
    `keys of client.connection before connect(): ${Object.keys(client.connection)}`,
  );

  try {
    await client.connect();
  } catch (err) {
    console.log(err);
    return;
  }

  const res = await client.query(
    `SELECT * FROM users WHERE email = '${reqPayload.email}' AND ${condition};`,
  );

  await client.end();

  console.log(
    `keys of client.connection after end(): ${Object.keys(client.connection)}`,
  );
  console.log(
    `value of client.connection._connecting after end(): ${client.connection._connecting}`,
  );

  return res;
};

const changeUserData = async (reqPayload) => {
  const col = reqPayload.ColumnName;
  const maybeQuote = col === 'is_verified' ? '' : "'";

  await client.connect();

  await client.query(
    `UPDATE users SET ${col} = ${maybeQuote}${reqPayload[`${snakeToPascal(col)}`]}${maybeQuote} WHERE email = '${reqPayload.Email}';`,
  );

  await client.end();
};

export { cache, storeUserData, getUserData, changeUserData };
