const router = require('express').Router();
const { MySQLClient, sql } = require('../lib/database/client.js');

router.get('/', async(req, res, next) => {
  var prefectures = await MySQLClient.executeQuery(
    await sql('SELECT_PREFECTURES')
  );
  var results = [
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
  prefectures.forEach(element => {console.log(element.pref_code + element.pref_name);
    
  });
  console.log(prefectures);
  res.render('./search/list.ejs', { results, prefectures});
});

module.exports = router;