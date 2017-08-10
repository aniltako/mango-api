var router = require('express').Router();
var controller = require('./controller');
var auth = require('./auth');
var verifyUser = auth.verifyUser;
var checkUser = [auth.decodeToken(), auth.getFreshUser()];

/**
 * route for userDetail if the token is verified
 */
router.get('/me', checkUser, controller.me);

/**
 *  route for signIn
 */
router.post('/signIn', verifyUser(), controller.signIn)

module.exports = router;