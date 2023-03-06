const appconfig = require('./config/application.config.js');
const dbconfig = require('./config/mysql.config.js');
const path = require('path');
const logger = require('./lib/log/logger.js');
const accesslogger = require('./lib/log/accesslogger.js');
const applicationlogger = require('./lib/log/applicationlogger.js');
const accesscontrol = require('./lib/security/accesscontrol.js');
const express = require('express');
const favicon = require('serve-favicon');
const session = require('express-session');
const MySqlStore = require('express-mysql-session')(session);
const flash = require('connect-flash');
const app = express();

app.set('view engine', 'ejs');
app.disable('x-powered-by');

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use('/public', express.static(path.join(__dirname, '/public')));

app.use(accesslogger());

app.use(session({
  store: new MySqlStore({
    host: dbconfig.HOST,
    port: dbconfig.PORT,
    user: dbconfig.USERNAME,
    password: dbconfig.PASSWORD,
    database: dbconfig.DATABASE
  }),
  secret: appconfig.security.SESSION_SECRET,
  resave: false,
  saveUninitialized: true,
  name: 'sid'
}));

app.use(express.urlencoded({extended:true}));
app.use(flash());
app.use(...accesscontrol.initialize());

app.use('/account', require('./routes/account.js'));
app.use('/search', require('./routes/search.js'));
app.use('/shops', require('./routes/shops.js'));
app.use('/', require('./routes/index.js'));

app.use(applicationlogger());

app.listen(appconfig.PORT, () => {
  logger.application.info(`Application listening at :${appconfig.PORT}`);
});


