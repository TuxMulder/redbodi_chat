var router = require('express').Router();
var bcrypt = require('bcrypt');
var jwt = require('jwt-simple');
var Pharmacist = require('../../models/pharmacist');
var config = require('../../config');

router.get('/', function(req, res, next){
	if(!req.headers['x-auth']){
		console.log('no x-auth header');
		return res.status(401);
	}

	var auth = jwt.decode(req.headers['x-auth'], config.secret);
	Pharmacist.findOne({ name: auth.name }, function(err, pharmacist){
		if(err){
			console.log(err);
			return next(err);
		}
		res.status(201).json(pharmacist)
	});
});

router.post('/', function (req, res, next) {
	//TODO: makesure that req.body.pharmId matches supplied req.body.orgCode - validation essentially!!
	var pharmacist = new Pharmacist({
		name: req.body.name,
		email: req.body.email,
		orgCode: req.body.orgId
	});
	bcrypt.hash(req.body.password, 10, function (err, hash){
		if(err){
			return next(err);
		}
		pharmacist.password = hash;
		pharmacist.save(function (err){
			if(err){
				return next(err);
			}
			return res.status(201).json({ success: true });
		});
	});
});
module.exports = router;