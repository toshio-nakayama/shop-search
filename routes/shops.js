const router = require('express').Router();
const { authenticate, authorize, PRIVILEGE } = require('../lib/security/accesscontrol.js');

router.get('/', authorize(PRIVILEGE.NORMAL),(req, res, next)=>{
  var data = {
    name: 'テストショップ',
    categories: 'レストラン',
    tel:'999-999-999',
    address:'〇〇県〇〇市９-9-9',
    station:'東京駅',
    parking:'有',
    coupon:'有'
  };
  res.render('./shops/index.ejs', data);
});

module.exports = router;