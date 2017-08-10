var router = require('express').Router();
var logger = require('../../utils/logger');
var controller = require('./controller');
var auth = require('../auth/auth');
var checkUsername = auth.checkUsername;
//var checkUser = [auth.decodeToken(), auth.getFreshUser()];

router.param('id', controller.params);

router.route('/')
	.get(controller.get)
	.post(checkUsername(), controller.post)

router.route('/:id')
	.get(controller.getOne)
	.put(controller.put)
	.delete(controller.delete)

module.exports = router;