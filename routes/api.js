var express = require('express');
var router = express.Router();

/* GET API. */
router.get('/api', function(req, res, next) {

  var query = req.query;
  console.log(db);
  db.userinfo.findAll({}).then(function (userinfos){
    res.render('api', { info: JSON.stringify(userinfos) });
  });
  };

module.exports = router;
