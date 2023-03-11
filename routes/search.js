const router = require('express').Router();
const { MySQLClient, sql } = require('../lib/database/client.js');
const { authorize, PRIVILEGE } = require('../lib/security/accesscontrol.js');
const yahooapis = require('../lib/ajax/yahooapi.js');

router.get('/', authorize(PRIVILEGE.NORMAL), async (req, res, next) => {
  var prefectures = await MySQLClient.executeQuery(
    await sql('SELECT_PREFECTURES')
  );
  var prefecture = req.query.prefecture || '';
  var city = req.query.city || '';
  var keyword = req.query.keyword || '';
  var results;

  try {
    if (prefecture && city && keyword) {
      results = yahooapis.deserialize(
        await yahooapis.localSearch(keyword, city, 'json', true)
      );
      // console.log(results);
    } else {
      results = [];
    }
    res.render('./search/list.ejs', { results, prefectures });
  } catch (err) {
    next(err);
  }
});

module.exports = router;