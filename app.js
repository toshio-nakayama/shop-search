const PORT = process.env.PORT;
const path = require('path');
const logger = require('./lib/log/logger.js');
const accesslogger = require('./lib/log/accesslogger.js');
const applicationlogger = require('./lib/log/applicationlogger.js');
const express = require('express');
const favicon = require('serve-favicon');
const { MySQLClient } = require('./lib/database/client.js');
const app = express();

app.set('view engine', 'ejs');
app.disable('x-powered-by');

app.use(favicon(path.join(__dirname, '/public/favicon.ico')));
app.use("/public", express.static(path.join(__dirname, '/public')));

app.use(accesslogger());

app.use('/search', require('./routes/search.js'));
app.use('/shops', require('./routes/shops.js'));
app.use('/', require('./routes/index.js'));

app.use(applicationlogger());

app.listen(PORT, () => {
  logger.application.info(`Application listening at ${PORT}`);
});


