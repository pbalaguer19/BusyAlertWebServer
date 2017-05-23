var express = require('express');
var router = express.Router();

router.get('/api', function(req, res){
  var query = req.query;
  //var attr = ['userId', 'action', 'extraData'];

  db.userinfo.findAll({}).then(function (userinfos){
    res.json(userinfos);
  }, function (e) {
    res.status(500).send();
  });
});

router.post('/api', function(req, res){
	db.userinfo.create({
    userId: req.body.userId,
    action: req.body.action,
    extraData: req.body.extraData
  }).then(function (userinfos) {
		res.json(userinfos);
	}, function (e) {
    console.log(req);
		res.status(400).json(e);
	});
});

module.exports = router;
