const router = require('express').Router();
const { authorize, PRIVILEGE } = require('../lib/security/accesscontrol.js');

router.post('/', authorize(PRIVILEGE.NORMAL), (req, res, next) => {
  const shop = JSON.parse(req.body.shop);
  res.render('./shops/index.ejs', processData(shop));
});

function processData(shop){
  //genre
  if (typeof shop.genre == 'undefined') {
    shop.genre = '-';
  } else if (shop.genre.length) {
    shop.genre = shop.genre[0].Name;
  } else {
    shop.genre = '-';
  }
  //station
  if (typeof shop.station == 'undefined') {
    shop.station = '-';
  } else if (shop.station.length) {
    var text = '';
    shop.station.forEach(v => {
      text = text.concat(v.railway, ' ', v.name, '\n');
    });
    shop.station = text;
  }
  //parking
  if (typeof shop.parking == 'undefined') {
    shop.parking = '-';
  } else {
    shop.parking = JSON.parse(shop.parking) ? '有' : '無';
  }
  //coupon
  if (typeof shop.coupon == 'undefined') {
    shop.coupon = '-';
  } else {
    shop.coupon = JSON.parse(shop.coupon) ? '有' : '無';
  }
  //image
  if(typeof shop.image == 'undefined'){
    shop.image = '/public/images/dummy/1150x250.png';
  }
  return shop;
}

module.exports = router;