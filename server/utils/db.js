var config = require('../config/config');
var mongoose = require('mongoose');
mongoose.Promise = require('bluebird');

mongoose.connect(config.db.url);