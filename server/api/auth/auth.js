var jwt = require('jsonwebtoken');
var expressJwt = require('express-jwt');
var config = require('../../config/config');
var User = require('../user/model');
var checkToken = expressJwt({secret: config.secrets.jwt});
var logger = require('../../utils/logger');

/**
 * return token if token is verified less return unauthorized error message
 */
exports.decodeToken = function(){
	return function(req, res, next){

		//check if the token is passed with request or not
		var token = req.body.token || req.query.token || req.headers['x-access-token']

		if(token){

			req.headers.authorization = 'Bearer ' + token;
			req.token = token;
		}else{
			return res.status(403).send({
				error: 'No token provided.'
			});
		}

		checkToken(req, res, next);
	};
}

/**
 * return user if the token is sent with authorized user _id
 *
 */
exports.getFreshUser = function(){
	return function(req, res, next){

		var decoded = jwt.verify(req.token, config.secrets.jwt);

		logger.log("Checking user in database");

        User.findById(decoded._id)
            .then(function(user){
                if(!user){
                    next(new Error('No user with that id'));
                }else{
                    req.user = user;
                    next();
                }
            }, function(err){
                next(err);
            });

	}
};

/**
 * returns user if the username and password is matched
 */
exports.verifyUser = function(){
	return function(req, res, next){
		var username = req.body.username;
		var password = req.body.password;

		logger.log("Verifying user...... "+ username);

		if(!username || !password){
            res.status(400);
            next(new Error('You need a username and password'));
		}

        User.findOne({ username: username }, function(err, user) {
            if (err){
                next(new Error(err)) 
            }else if(user){

                logger.log(user, "user")
                var newUser = new User(user);

                if(newUser.authenticate(password)){
                    req.user = user;
					next();
                }else{
					res.status(400);
                    next(new Error('Incorrect Password.'))              

                }
            }else{
				res.status(400);
                next(new Error('Email doesnot exits.'));              
            }
        });
	}
}

/**
 *  Return next middleware if the dublicate user is not found else return error message
 */
exports.checkUsername = function(){
	return function( req, res, next ){
		var username = req.body.username;

		User.findOne({ username: username }, function(err, user) {
            if (err){
                next(new Error(err)) 
            }else if(user){

                res.status(400);
                next(new Error('Username already used.')) ;

            }else{
                next();              
            }
        });
	}
};

/*
 * @param id
 * @returns {token with the secrets}
 */
exports.signToken = function(id){
    return jwt.sign(
        {'_id':id},
        config.secrets.jwt
    );

};