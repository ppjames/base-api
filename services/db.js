
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
// const username = process.env.DB_USER || global.config.db.user;
// const password = process.env.DB_PASS || global.config.db.password;
// const host = process.env.DB_HOST || global.config.db.ip;
// const port = process.env.DB_PORT || global.config.db.port;
// const database = process.env.DB_NAME || global.config.db.database;

// const connString = process.env.DB_CONNSTR || `mongodb://${username}:${password}@${host}:${port}/${database}`;
const connString = process.env.DB_CONNSTR || `mongodb://127.0.0.1:27017/viaticos`;


/* mongoose
  .connect(
    connString,
    global.config.db.options,
  )
  .then(() => {
    console.info('Database connection successful');
    mongoose.set('debug', true);
  })
  .catch((err) => {
    console.error('Database connection error', { error: err });
  }); */

// mongoose.set('debug', true);

let attempts = 0;
const options = {
  "useNewUrlParser": true,
}

function connect() {
  attempts++;
  console.info(`attempts connection database ${ attempts }`)
  mongoose.connect(connString, options)
}

mongoose.connection.on('connected', function() {
  console.info("[Event connected]")
  console.info('Database connection successful');
  attempts = 0;
})

mongoose.connection.on('error', error => {
  console.error('[Event error]', { error })
})

mongoose.connection.on('disconnected', function() {
  console.warn("[Event disconnected]")
  setTimeout(connect, 1000);
})

connect();

