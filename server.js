/* eslint-disable no-underscore-dangle */

require('dotenv').config();
require('express-async-errors');

const express = require('express');
const axios = require('axios').default;
const path = require('path');

const app = express();
const cors = require('cors');
const crypto = require('crypto');
const passport = require('passport');
const socketio = require('socket.io');
const session = require('express-session');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const { CronJob } = require('cron');
const expressMongoDb = require('express-mongo-db');
const { introspectionQuery } = require('graphql');
const MongoStore = require('connect-mongo')(session);
const asyncHandler = require('express-async-handler');
const validator = require('./validator.js');
const { getNextSequenceValue, client, calculateQuotaUsed } = require('./mongodb_util');
const { executeQuery } = require('./graphql_util');
const { query } = require('./sql');
const authController = require('./lib/auth.controller');
const passportInit = require('./lib/passport.init');
const {
  makeGeneralError, makeSuccess, checkUser, getCronPattern, insertNewFolder, insertNewSwaggerFile, insertNewTranslationFile,
} = require('./util');

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, 'build'), { index: false }));
}

app.use(express.json());
app.use(passport.initialize());
passportInit();

app.use(expressMongoDb('mongodb://localhost:27017/listenonline'));

if (process.env.NODE_ENV === 'development') {
  app.use(cors());
}

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: true,
  saveUninitialized: true,
  store: new MongoStore({ client }),
}));

app.all('*', checkUser);

const mongo_db = process.env.NODE_ENV == "test" ? process.env.TEST_MONGODB:process.env.DEFAULT_MONGODB

client.connect(async () => {
  const db = client.db(mongo_db);

  try {
    const counter = await db.collection('counters').findOne({ _id: 'server_id' });

    if (!counter) {
      db.collection('counters').insertOne({ _id: 'server_id', sequence_value: 0 });
    }
  } catch (error) {
    console.log(error);
  }
});

/* POTENTIAL REFACTOR TO ONE ENDPOINT */
app.get('/auth/twitter/callback', passport.authenticate('twitter'), authController.twitter);

app.get('/auth/youtube/callback', passport.authenticate('youtube'), authController.youtube);

app.get('/auth/reddit/callback', passport.authenticate('reddit'), authController.reddit);

app.get('/auth/stackexchange/callback', passport.authenticate('stack-exchange'), authController.stackexchange);

app.get('/auth/facebook/callback', passport.authenticate('facebook'), authController.facebook);

app.get('/app/api/social-media-socket/:name', asyncHandler(async (req, res, next) => {
  req.session.slug = req.params.name;
  req.session.socketId = req.query.socketId;

  if (req.session.slug === 'reddit') {
    req.session.state = crypto.randomBytes(32).toString('hex');
    passport.authenticate('reddit', { state: req.session.state, duration: 'permanent' })(req, res, next);
  } else {
    passport.authenticate(req.session.slug)(req, res, next);
  }
}));

app.post('/app/api/home/contact', asyncHandler(async (req, res) => {
  const { email, name, content } = req.body;

  await query('insert into interested_parties(name, email, about) values (?,?,?)', [name, email, content]);

  res.send(makeSuccess('Contact Submitted!'));
}));

app.post('/app/api/auth/login', validator.loginValidationRules(), validator.validate, asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = (await query('select id, email, name, isAdmin, password from users where email = ?', [email]))[0];

  // check for invalid email
  if (!user) {
    throw new Error('Email or Password is incorrect');
  }

  // check for invalid password
  if (!(await bcrypt.compare(password, user.password))) {
    throw new Error('Email or Password is incorrect');
  }

  user.isAdmin = !!parseInt(user.isAdmin, 10);
  req.session.user_id = user.id;
  req.session.isAdmin = user.isAdmin;

  res.send(makeSuccess({ email: user.email, name: user.name, isAdmin: user.isAdmin }));
}));

app.post('/app/api/auth/register', validator.registerValidationRules(), validator.validate, asyncHandler(async (req, res) => {
  const { email, name, password } = req.body;

  query('insert into users(name, email, password, uuid) values (?,?,?,?)',
    [name, email, await bcrypt.hash(password, bcrypt.genSaltSync(12)), uuidv4()]);

  const user = (await query('select id, isAdmin from users where email = ?', [email]))[0];

  user.isAdmin = !!parseInt(user.isAdmin, 10);
  req.session.user_id = user.id;
  req.session.isAdmin = user.isAdmin;

  res.send(makeSuccess({ email: user.email, name: user.name, isAdmin: user.isAdmin }));
}));

app.get('/app/api/auth/logout', asyncHandler(async (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(500);
      return res.send(err.message);
    }
    return res.send(makeSuccess('Success logging out'));
  });
}));

app.get('/app/api/servers', asyncHandler(async (req, res) => {
  const servers = await req.db.collection('graphql_servers').find({}, {
    _id: 0,
    name: 1,
    url: 1,
    slug: 1,
    description: 1,
    requireAuthentication: 1,
    requireAuthorization: 1,
  }).toArray();

  res.send(makeSuccess(servers));
}));

app.put('/app/api/server/update', validator.serverValidationRules(), validator.validate, asyncHandler(async (req, res) => {
  const { data, type, previousServerName } = req.body;
  const schema = (await axios.post(data.url, { query: introspectionQuery })).data;

  if (type === 0) {
    // ADD
    await req.db.collection('graphql_servers').insertOne({ _id: await getNextSequenceValue('server_id', req.db), ...data, schema });
  } else if (type === 1) {
    // DELETE
    await req.db.collection('graphql_servers').removeOne({ name: data.name });
    await req.db.collection('queries').remove({ source: data.name });
  } else if (type === 2) {
    // UPDATE
    await req.db.collection('graphql_servers').updateOne({ name: previousServerName }, { ...data, schema });
  }

  res.send(makeSuccess(data));
}));

app.get('/app/api/server/refresh', asyncHandler(async (req, res) => {
  const { name } = req.query;

  const server = await req.db.collection('graphql_servers').findOne({ name });

  const newSchema = (await axios.post(server.url, { query: introspectionQuery })).data;

  req.db.collection('graphql_servers').updateOne({ _id: server._id }, { $set: { schema: newSchema } });

  res.send(makeSuccess(name));
}));

// /   social media platforms    ////
app.get('/app/api/social-media-platforms', asyncHandler(async (req, res) => {
  const allServers = [];

  const authorizations = await query('SELECT server_id FROM authorizations WHERE user_id = ?', [req.session.user_id]);

  const authorizedServerIds = [];
  authorizations.forEach((data) => {
    authorizedServerIds.push(data.server_id);
  });

  const servers = await req.db.collection('graphql_servers').find({}).toArray();

  servers.forEach((server) => {
    if (server.requireAuthorization && !(allServers.some((s) => server.slug === s.name))) {
      allServers.push({
        name: server.slug,
        imageURL: '',
        isAuthenticated: authorizedServerIds.includes(server._id),
      });
    }
  });

  res.send(makeSuccess(allServers));
}));

app.get('/app/api/queries', asyncHandler(async (req, res) => {
  const queries = await req.db.collection('queries').find({ user_id: req.session.user_id }, {
    _id: 0, name: 1, source: 1, schedule: 1, schema: 1,
  }).toArray();

  res.send(makeSuccess(queries));
}));

app.get('/app/api/query/sources', asyncHandler(async (req, res) => {
  let sources = await req.db.collection('graphql_servers').find({}).toArray();

  // First, Catch a situation of there being no servers added
  if (!sources.length) {
    throw new Error('There are no active servers with schema available to query.');
  }

  const authorizations = await query('SELECT * FROM authorizations WHERE user_id = ?', [req.session.user_id]);

  // Next, filter on the servers that this user can query.
  // If they require authorization, the user must provide one. Otherwise they cannot use that server
  // Likewise if the server doesn't require authorizaiton they can query it
  sources = sources.filter((source) => {
    if (source.requireAuthentication || source.requireAuthorization) {
      return authorizations.some((auth) => auth.server_id === source._id);
    }

    return true;
  });

  // At this point, if there are no servers available they need to authorize.
  if (!sources.length) {
    throw new Error('You need to provide authorization in order to query the servers available.');
  }

  res.send(makeSuccess(sources.map((source) => source.name)));
}));

app.get('/app/api/query/full-schema', asyncHandler(async (req, res) => {
  const { source } = req.query;
  const result = await req.db.collection('graphql_servers').findOne({ name: source }, { _id: 0, schema: 1 });
  res.send(makeSuccess(result.schema));
}));

app.put('/app/api/query/update', validator.queryValidationRules(), validator.validate, asyncHandler(async (req, res) => {
  const { data, type } = req.body;

  const { _id, url, slug } = await req.db.collection('graphql_servers').findOne({ name: data.source }, { url: 1, slug: 1 });
  const serverId = _id;

  if (type === 0) {
    // ADD
    req.db.collection('queries').insertOne({ ...data, server_id: serverId, user_id: req.session.user_id });

    if (data.schedule !== 'Ad hoc') {
      const job = new CronJob({
        cronTime: getCronPattern(data.schedule),
        onTick: async function execute() {
          await executeQuery(url, slug, data.schema, serverId, req, this.queryName);
        },
        context: { queryName: data.name },
      });

      job.start();
    }
  } else if (type === 1) {
    // DELETE
    await req.db.collection('queries').removeOne({ name: data.name, user_id: req.session.user_id });
    await req.db.collection('query_histories').remove({ query_name: data.name, user_id: req.session.user_id });
  } else if (type === 2) {
    // EXECUTE
    await executeQuery(url, slug, data.schema, serverId, req, data.name);
  }

  res.send(makeSuccess(data));
}));

app.put('/app/api/query/execute', validator.queryValidationRules(), validator.validate, asyncHandler(async (req, res) => {
  const queryData = req.body.queryName;
  const data = await req.db.collection('queries').findOne({ name: queryData }, { source: 1, schema: 1 });
  const { _id, url, slug } = await req.db.collection('graphql_servers').findOne({ name: data.source }, { url: 1, slug: 1 });
  const serverId = _id;

  await executeQuery(url, slug, data.schema, serverId, req, queryData);

  res.send(makeSuccess(data));
}));

app.get('/app/api/query/history-records', asyncHandler(async (req, res) => {
  const { queryName } = req.query;

  const history = await req.db.collection('query_histories').find({ query_name: queryName, user_id: req.session.user_id }, {
    _id: 0, executionTimestamp: 1, runtime: 1, data: 1,
  }).toArray();
  res.send(makeSuccess(history));
}));


app.get('/app/api/users', asyncHandler(async (req, res) => {
  const users = await query('SELECT name, isAdmin, email, quota, id FROM users WHERE id <> ?', [199]);

  const results = users.map(async (user) => ({
    ...user,
    usedQuota: (await calculateQuotaUsed(user.id, req.db)),
  }));

  res.send(makeSuccess(await Promise.all(results)));
}));

app.put('/app/api/user/update', asyncHandler(async (req, res) => {
  const { data, type } = req.body;

  if (type === 0) {
    // DELETE
    const deletedUser = (await query('select id from users where email = ?', [data.email]))[0];

    await req.db.collection('queries').remove({ user_id: deletedUser.id });
    await req.db.collection('query_histories').remove({ user_id: deletedUser.id });

    await query('delete from users where email = ?', [data.email]);
  } else if (type === 1) {
    // UPDATE
    await query('update users set isAdmin = ?, quota = ? WHERE email = ?',
      [data.isAdmin, data.quota, data.name, data.email]);
  }
  res.send(makeSuccess(data));
}));

app.get('/app/api/applications', asyncHandler(async (req, res) => {
  const result = await query('select callback as callbackURL, home, name, description, cast(id as char) as id from applications WHERE user_id = ?', [req.session.user_id]);
  res.send(makeSuccess(result));
}));

app.put('/app/api/application/update', validator.applicationValidationRules(), validator.validate, asyncHandler(async (req, res) => {
  const { data, type, previousApplicationName } = req.body;

  if (type === 0) {
    // UPDATE
    await query('update applications set name = ?, callback = ?, home = ?, description = ? WHERE name = ?',
      [data.name, data.callbackURL, data.home, data.description, previousApplicationName]);
  } else if (type === 1) {
    // DELETE
    await query('delete from applications where id = ?', [parseInt(data.id, 10)]);
  } else if (type === 2) {
    // CREATE
    await query('insert into applications(name, callback, home, description, user_id) values (?,?,?,?,?)',
      [data.name, data.callbackURL, data.home, data.description, req.session.user_id]);
  }

  res.send(makeSuccess(data));
}));

/* Translation tool endpoint */
app.get('/app/api/translation-tool/files', asyncHandler(async (req, res) => {
  const fileSystem = (await req.db.collection('file_system').findOne({})).file_system;
  res.send(makeSuccess(fileSystem));
}));

app.post('/app/api/translation-tool/folder', asyncHandler(async (req, res) => {
  const { location, folderName } = req.body.data;
  insertNewFolder(location, folderName, req);

  res.send(makeSuccess('Successfully Inserted New Folder'));
}));

// app.get('/app/api/translation-tool/swagger_files', asyncHandler(async (req, res) => {
//   const swaggerFiles = await req.db.collection('swagger_files').find({}, { _id: 0, slug: 1 }).toArray();
//   res.send(makeSuccess(swaggerFiles.map((swaggerFile) => swaggerFile.slug)));
// }));

app.get('/app/api/translation-tool/swagger', asyncHandler(async (req, res) => {
  const { name } = req.query;
  const { swagger } = await req.db.collection('swagger_files').findOne({ name });
  res.send(makeSuccess(swaggerFile));
}));

app.post('/app/api/translation-tool/swagger', asyncHandler(async (req, res) => {
  const { swaggerName, swagger, location } = req.body.data;

  insertNewSwaggerFile(swaggerName, swagger, location, 'swagger_files', req);

  res.send(makeSuccess('Successfully Inserted Swagger File'));
}));

app.delete('/app/api/translation-tool/swagger', asyncHandler(async (req, res) => {
  // TODO
}));

app.get('/app/api/translation-tool/translation', asyncHandler(async (req, res) => {
  const { name } = req.body.data;

  const { translationFile } = await req.db.collection('translation_files').findOne({ name });

  res.send(makeSuccess(translationFile));
}));

app.post('/app/api/translation-tool/translation', asyncHandler(async (req, res) => {
  const {
    translation, translationName, swaggerName, location,
  } = req.body.data;

  insertNewTranslationFile(translationName, translation, location, swaggerName, req);

  res.send(makeSuccess('Successfully Inserted Translation File'));
}));

app.delete('/app/api/translation-tool/translation', asyncHandler(async (req, res) => {
  // TODO
}));

app.put('/app/api/translation-tool/translation', asyncHandler(async (req, res) => {
  // TODO
}));

if (process.env.NODE_ENV === 'production') {
  app.get(['/app', '/app/*'], (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
  });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'home.html'));
  });
}

// eslint-disable-next-line no-unused-vars
app.use((error, _req, res, next) => {
  console.log(error);
  res.send(makeGeneralError([error.message]));
});

const p =process.env.NODE_ENV === 'test' ? 3010:3000;
const server = app.listen(p, () => {
    // const host = server.address().address;
  const host = process.env.NODE_ENV === 'test' ? "localhost" : server.address().address;
  const { port } = process.env.NODE_ENV === 'test' ? 3010 : server.address();


  console.log('Example app listening at http://%s:%s', host, port);
});


const io = socketio(server);
app.set('io', io);


module.exports = server;
