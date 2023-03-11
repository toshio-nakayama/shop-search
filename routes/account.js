const router = require('express').Router();
const { authenticate } = require('../lib/security/access-control.js');
const { MySQLClient, sql } = require('../lib/database/client.js');
const { check, validationResult } = require('express-validator');

var createErrorMessage = function (error) {
  var result = '<div class="alert alert-danger">';
  result += '<div><i class="fa fa-fw fa-exclamation-circle"></i>' + error + '</div>';
  result += '</div>';
  return result;
};

var createErrorMessages = function (errors) {
  var result = '<div class="alert alert-danger">';
  var result_arr = errors.array();
  for (var n in result_arr) {
    result += '<div><i class="fa fa-fw fa-exclamation-circle"></i>' + result_arr[n].msg + '</div>';
  }
  result += '</div>';
  return result;
};

router.get('/', (_req, res, _next) => {
  res.render('./account/index.ejs');
});

router.get('/login', (req, res) => {
  res.render('./account/login.ejs', { message: req.flash('message') });
});

router.post('/login', authenticate());

router.get('/register', (_req, res) => {
  var error_msg = '';
  var form = { username: '', email: '', password: '' };
  res.render('./account/register-form.ejs', { error_msg, form });
});

router.post('/register/execute', [
  check('username')
    .not().isEmpty().withMessage((_value, { req }) => {
      return req.__('validation.message.username.required');
    })
    .isLength({ min: 3, max: 10 }).withMessage((_value, { req }) => {
      return req.__('validation.message.username.range');
    }),
  check('email')
    .not().isEmpty().withMessage((_value, { req }) => {
      return req.__('validation.message.email.required');
    })
    .isEmail().withMessage((_value, { req }) => {
      return req.__('validation.message.email.pattern');
    }),
  check('password')
    .not().isEmpty().withMessage((_value, { req }) => {
      return req.__('validation.message.password.required');
    })
    .isLength({ min: 8, max: 20 }).withMessage((_value, { req }) => {
      return req.__('validation.message.password.range');
    })
    .matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])/).withMessage((_value, { req }) => {
      return req.__('validation.message.password.pattern');
    })
], async (req, res, next) => {
  var form = req.body;
  var error_msg;
  var transaction;
  var errors = validationResult(req);
  if (!errors.isEmpty()) {
    error_msg = createErrorMessages(errors);
    res.render('./account/register-form.ejs', { error_msg, form });
    return;
  } else {
    try {
      var count = (await MySQLClient.executeQuery(
        await sql('SELECT_COUNT_USER_BY_EMAIL'),
        [`%${req.body.email}%`]
      ))[0].count;
      if (count) {
        error_msg = createErrorMessage((_value, { req }) => {
          return req.__('validation.message.register.already');
        });
        res.render('./account/register-form.ejs', { error_msg, form });
        return;
      }
    } catch (err) {
      next(err);
    }
    try {
      transaction = await MySQLClient.beginTransaction();
      transaction.executeQuery(
        await sql('INSERT_USER'),
        [`%${req.body.username}%`, `%${req.body.email}%`, `%${req.body.password}%`]
      );
      await transaction.commit();
    } catch (err) {
      await transaction.rollback();
      next(err);
      return;
    }
    res.render('./account/register-complete.ejs');
  }
});

router.post('/logout', (req, res, _next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;