const IS_PRODUCTION = process.env.NODE_ENV === "production";
const appConfig = require('./config/application.config.js');
const dbConfig = require('./config/mysql.config.js');
const path = require('path');
const logger = require('./lib/log/logger.js');
const accessLogger = require('./lib/log/access-logger.js');
const applicationLogger = require('./lib/log/application-logger.js');
const accessControl = require('./lib/security/access-control.js');
const express = require('express');
const favicon = require('serve-favicon');
const cookie = require('cookie-parser');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const gracefulShutdown = require('http-graceful-shutdown');
const i18n = require('i18n');
const app = express();

app.set('view engine', 'ejs');
app.disable('x-powered-by');

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(accessLogger());

app.use(i18n.init);
i18n.configure({
  locales: ['ja'],
  directory: __dirname + '/locales',
  objectNotation: true
});
app.use(cookie());
app.use(session({
  store: new MySqlStore({
    host: dbConfig.HOST,
    port: dbConfig.PORT,
    user: dbConfig.USERNAME,
    password: dbConfig.PASSWORD,
    database: dbConfig.DATABASE
  }),
  cookie: {
    secure: IS_PRODUCTION
  },
  secret: appConfig.security.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: 'sid'
}));

app.use(express.urlencoded({ extended: true }));
app.use(flash());
app.use(...accessControl.initialize());

app.use('/account', require('./routes/account.js'));
app.use('/search', require('./routes/search.js'));
app.use('/shops', require('./routes/shops.js'));
app.use('/', require('./routes/index.js'));

app.use(applicationLogger());

var server = app.listen(appConfig.PORT, () => {
  logger.application.info(`Application listening at :${appConfig.PORT}`);
});

gracefulShutdown(server, {
  signals: 'SIGINT SIGTERM',
  timeout: 10000,
  onShutdown: () => {
    return new Promise((resolve, reject) => {
      const { pool } = require('./lib/database/pool.js');
      pool.end((err) => {
        if (err) {
          return reject(err);
        }
        resolve();
      });
    });
  },
  finally: () => {
    const logger = require('./lib/log/logger.js').application;
    logger.info('Application shutdown finished.');
  }
});