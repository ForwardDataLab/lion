require('dotenv').config();

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcryptjs');
const { query } = require('./sql');
const { client } = require('./mongodb_util');
const mongo_db = process.env.NODE_ENV == "test" ? process.env.TEST_MONGODB:process.env.DEFAULT_MONGODB


const init = async () => {
  client.connect(async () => {
    try {
      const db = client.db(mongo_db);

      await db.collection('file_system').insertOne({
        file_system: [{
          name: '/',
          children: [],
        }],
      });

      await query('insert into users(name, email, password, uuid, isAdmin) values (?,?,?,?,?)',
        ['test', 'test@gmail.com', await bcrypt.hash('test', bcrypt.genSaltSync(12)), uuidv4(), 1]);
    } catch (error) {
      console.log(error);
    } finally {
      console.log('Inserted into db. Press ctrl+c to exit.');
    }
  });
};

init();
