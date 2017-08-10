var config = require('../config/config');
var _ = require('lodash');

//create a noop (no operation ) fucntion for when loggin is disabled
var noop = function(){};
//check if loggin is enabled in the config
//if it is , then use console.log
//fi not then noop

var consoleLog = config.logging ? console.log.bind(console): noop;

var logger = {
	log:function(){
		//arguments is an array like object with all the passed
		//in arguments to this function
		var args = _.toArray(arguments)
			.map(function(arg){
				if(typeof arg === 'object'){
					//turn the obejct to a string so wee
					//can log all the properties and color it
					var string = JSON.stringify(arg, 2);
					return string.bold.green;
				}else{
					arg+= '';
					return arg.bold.green;
				}
			});
			//call either console.log or noop here
			//with the console object as the content
			//and the new colored args
			consoleLog.apply(console, args);
	}
}

module.exports = logger;