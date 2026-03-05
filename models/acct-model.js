import dotenv from 'dotenv';
import bcrypt from 'bcrypt';
import { snakeToPascal } from '../util/snakeToPascal.js';
import { /* Client */ Pool } from 'pg';

dotenv.config();

// const client = new Client({
//   host: '127.0.0.1', // loopback IP, or localhost
//   port: 5432, // default PostgreSQL port
//   user: 'ubuntu',
//   password: '7yqZYlLIaf',
//   database: 'authdb',
// });
const pool = new Pool({
  host: '127.0.0.1', // loopback IP, or localhost
  port: 5432, // default PostgreSQL port
  user: 'ubuntu',
  password: '7yqZYlLIaf',
  database: 'authdb',
});

const cache = {};

// let client = null;

// const createClient = () => {
//   client = new Client({
//     host: '127.0.0.1', // loopback IP, or localhost
//     port: 5432, // default PostgreSQL port
//     user: 'ubuntu',
//     password: '7yqZYlLIaf',
//     database: 'authdb',
//   });
// };

const storeUserData = async (reqPayload) => {
  cache[reqPayload.Email] = reqPayload;

  // createClient();
  // await client.connect();

  const encryptedPassword = await bcrypt.hash(reqPayload.Password, 10);
  // await client.query(
  //   `INSERT INTO users (email, first_name, last_name, password, verification_string, is_verified) VALUES ('${reqPayload.Email}', '${reqPayload['First name']}', '${reqPayload['Last name']}', '${encryptedPassword}', '${reqPayload.VerificationString}', FALSE);`,
  // );
  await pool.query(
    `INSERT INTO users (email, first_name, last_name, password, verification_string, is_verified) VALUES ('${reqPayload.Email}', '${reqPayload['First name']}', '${reqPayload['Last name']}', '${encryptedPassword}', '${reqPayload.VerificationString}', FALSE);`,
  );

  // await client.end();
  // createClient();
};

const getUserData = async (reqPayload) => {
  // // console.log(
  // //   `keys of client.connection before connect(): ${Object.keys(client.connection)}`,
  // // );
  // createClient();
  // try {
  //   await client.connect();
  // } catch (err) {
  //   console.log(err);
  //   return;
  // }

  const condition = reqPayload.Condition || '1 = 1';
  // const res = await client.query(
  //   `SELECT * FROM users WHERE email = '${reqPayload.email}' AND ${condition};`,
  // );
  const res = await pool.query(
    `SELECT * FROM users WHERE email = '${reqPayload.email}' AND ${condition};`,
  );

  // await client.end();
  // // console.log(
  // //   `keys of client.connection after end(): ${Object.keys(client.connection)}`,
  // // );
  // // console.log(
  // //   `value of client.connection._connecting after end(): ${client.connection._connecting}`,
  // // );
  // createClient();

  return res;
};

const changeUserData = async (reqPayload) => {
  const col = reqPayload.ColumnName;
  const maybeQuote = col === 'is_verified' ? '' : "'";

  // createClient();
  // await client.connect();

  // await client.query(
  //   `UPDATE users SET ${col} = ${maybeQuote}${reqPayload[`${snakeToPascal(col)}`]}${maybeQuote} WHERE email = '${reqPayload.Email}';`,
  // );
  await pool.query(
    `UPDATE users SET ${col} = ${maybeQuote}${reqPayload[`${snakeToPascal(col)}`]}${maybeQuote} WHERE email = '${reqPayload.Email}';`,
  );

  // await client.end();
  // createClient();
};

export { cache, storeUserData, getUserData, changeUserData };
