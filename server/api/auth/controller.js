var auth = require('./auth');
var signToken = auth.signToken;

exports.me = function(req, res, next) {

    return res.status(200).send(req.user);
};

exports.signIn = function(req, res, next) {
    var user = req.user;

    var token = signToken(user._id);

	res.json( { token: token } );
};