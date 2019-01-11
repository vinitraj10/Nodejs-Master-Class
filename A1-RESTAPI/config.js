/*
*	Create and export the configuration file
*
*/


// Creating the environment object to hold the important configurations
var environment = {};

// Defining staging configuration
environment.staging = {
	'httpPort':8080,
	'httpsPort':8081,
	'envName':'staging'
}

// Defining production configuration
environment.production = {
	'httpPort':8000,
	'httpsPort':8001,
	'envName':'production'
}

// Determining which environment is passed through cli
var currentEnv = typeof(process.env.NODE_ENV) =='string' ? process.env.NODE_ENV.toLowerCase() : '';

// Finding whether the environment exists or not if not we will use staging environment
var envToExport = typeof(environment[currentEnv]) == 'object' ? environment[currentEnv] :environment.staging;

// export the required environment object

module.exports = envToExport;