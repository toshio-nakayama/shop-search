const router = require('express').Router();

router.get('/login', (req, res, next)=>{
  res.render('./account/login.ejs');
});

module.exports = router;