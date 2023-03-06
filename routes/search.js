const MAX_ITEMS_PER_PAGE = require('../config/application.config.js').search.MAX_ITEMS_PER_PAGE;
const router = require('express').Router();

router.get('/', (req, res, next) => {
  var page = req.query.page ? parseInt(req.query.page) : 1;
  var keyword = req.query.keyword || "";
  var count, results;

  var dummyData = [
    {id:'1', name: 'テストショップ1', categories: '衣料品'},
    {id:'2', name: 'テストショップ3', categories: '中華料理'},
    {id:'3', name: 'テストショップ2', categories: '食料品'},
    {id:'4', name: 'テストショップ4', categories: 'イタリアン'},
    {id:'5', name: 'テストショップ5', categories: 'フレンチ'},
    {id:'6', name: 'テストショップ6', categories: '衣料品'},
    {id:'7', name: 'テストショップ7', categories: '中華料理'},
    {id:'8', name: 'テストショップ8', categories: '食料品'},
    {id:'9', name: 'テストショップ9', categories: 'イタリアン'},
    {id:'10', name: 'テストショップ10', categories: 'フレンチ'},
    {id:'11', name: 'テストショップ11', categories: '衣料品'},
    {id:'12', name: 'テストショップ12', categories: '中華料理'},
    {id:'13', name: 'テストショップ13', categories: '食料品'},
    {id:'14', name: 'テストショップ14', categories: 'イタリアン'},
    {id:'15', name: 'テストショップ15', categories: 'フレンチ'},
  ];

  if (keyword) {
    count = dummyData.length;
    results = dummyData;
  } else {
    count = MAX_ITEMS_PER_PAGE;
    results = {};
  }
  res.render('./search/list.ejs', {
    keyword,
    count,
    results,
    pagination:{
      max: Math.ceil(count / MAX_ITEMS_PER_PAGE),
      current:page
    }
  });
});

module.exports = router;