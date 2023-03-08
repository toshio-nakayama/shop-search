const router = require('express').Router();
const { authenticate } = require('../lib/security/accesscontrol.js');
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

router.get('/', (req, res, next) => {
  res.render('./account/index.ejs');
});

router.get('/login', (req, res) => {
  res.render('./account/login.ejs', { message: req.flash('message') });
});

router.post('/login', authenticate());

router.get('/register', (req, res) => {
  var error_msg = '';
  var form = { username: '', email: '', password: '' };
  res.render('./account/register-form.ejs', { error_msg, form });
});

router.post('/register/execute', [
  check('username')
    .not().isEmpty().withMessage('ユーザー名は必須入力です。')
    .isLength({ min: 3, max: 10 }).withMessage('ユーザー名は3文字以上10文字以下で入力してください。'),
  check('email')
    .not().isEmpty().withMessage('メールアドレスは必須入力です。')
    .isEmail().withMessage('メールアドレスを正しく入力してください。'),
  check('password')
    .not().isEmpty().withMessage('パスワードは必須入力です。')
    .isLength({ min: 8, max: 20 }).withMessage('ユーザー名は3文字以上10文字以下で入力してください。')
    .matches(/^(?=.*?[a-z])(?=.*?[A-Z])(?=.*?[0-9])/).withMessage('パスワードは英小文字、英大文字、数字を含めてください。')
], async (req, res, next) => {
  var form = req.body;
  var error_msg;
  var transaction;
  var result = validationResult(req);
  if (result.errors.length > 0) {
    error_msg = createErrorMessages(result);
    res.render('./account/register-form.ejs', { error_msg, form });
    return;
  } else {
    try {
      var user = await MySQLClient.executeQuery(
        await sql('SELECT_USER_BY_EMAIL'),
        [req.body.email]
      );
      if (user.length > 0) {
        error_msg = createErrorMessage('すでに登録されています。');
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
        [req.body.username, req.body.email, req.body.password]
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

router.post('/logout', (req, res, next) => {
  req.logout();
  res.redirect('/');
});

module.exports = router;