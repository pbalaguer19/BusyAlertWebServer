var express = require('express');
var router = express.Router();
var db = require('./models/index');


/* GET API. */
router.get('/api', function(req, res, next) {

  var query = req.query;
  db.userinfo.findAll({}).then(function (userinfos){
    res.render('api', { info: JSON.stringify(userinfos) });
  });
  };

module.exports = router;
