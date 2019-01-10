/*
*  Create and export the configuration variables
*
*/

// container for all the enivironments

var environments = {};

// Staging default environment
environments.staging = {
	'httpPort': 8080,
	'httpsPort': 8081,
	'envName': 'staging'
}

// Production environment

environments.production = {
	'port':8000,
	'httpsport':8001,
	'envName': 'production'
}

// Determine which environment was passed as command line argument

var currentEnvironment = typeof(process.env.NODE_ENV) == 'string' ? process.env.NODE_ENV.toLowerCase() : '';

// Check out the current environment is matched with our environment if not default is staging

var envToExport = typeof(environments[currentEnvironment]) == 'object' ? environments[currentEnvironment] : environments.staging;


module.exports = envToExport;