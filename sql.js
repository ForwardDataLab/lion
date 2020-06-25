const mysql = require('mysql');
const util = require('util');

let host =  process.env.DB_HOST;
let user =  process.env.DB_USERNAME;
let password = process.env.DB_PASSWORD;
let database = process.env.DB_DATABASE;

if(process.env.NODE_ENV == 'test'){
  host =  process.env.TEST_DB_HOST;
  user =  process.env.TEST_DB_USERNAME;
  password = process.env.TEST_DB_PASSWORD;
  database = process.env.TEST_DB_DATABASE;
}

const con = mysql.createConnection({
  host: host,
  user: user,
  password: password,
  database: database,
});

con.connect((err) => {
  if (err) throw err;
  console.log('Connected correctly to SQL');
});

module.exports = {
  query: util.promisify(con.query).bind(con),
};
