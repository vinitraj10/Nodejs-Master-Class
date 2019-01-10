// Dependencies

var https = require('https');
var http = require('http');
var url = require('url');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;


// It is an object which contains functions for the required url path.
var handlers = {};

// handler for url /hello/
handlers.hello = function(data,callback){
	/*
		All the business logic for any particular url should be written here.
		like if it was a registration url handler the database communication 
		would have taken place here.
	*/
	if(data.method != 'POST') {
		callback(405,{'message':'Method Not allowed'});
	}
	else {
		callback(200,{'message':'Welcome User!!'});
	}
}

// handler for not found urls
handlers.notfound = function(data,callback){
	callback(404);
}

// URL path which will call the logic for that url
var routes = {
	'hello':handlers.hello
}

// https server options
var httpsServerOptions = {
	'key':fs.readFileSync('./https/key.pem'),
	'cert':fs.readFileSync('./https/cert.pem')
}

// Instantiate HTTPS server
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
	unifiedServer(req,res);
});

// Instantiate HTTP server
var httpServer = http.createServer(function(req,res){
	unifiedServer(req,res);
});

// UnifiedServer which is passed to both http and https protocol since all the functionalities is same

var unifiedServer = function(req,res){
	/* Get the reqest url and parse it second parameter 
	   is true for query params it returns a url object 
	   which has information for the url
	*/
	var parsedUrl = url.parse(req.url,true);

	// Get the url path like - /hello/
	var path = parsedUrl.pathname;

	// Deletes unnecessary slashes
	var trimmedPath = path.replace(/^\/+|\/+$/g,'');

	/*
		To get query object from url we can do the following -
		var queryStringObject = path.query;
		To get request headers we can do the following -
		var headers = req.headers;
	*/

	// Get the http request method
	var method = req.method.toUpperCase();

	// Stringdecoder for getting the data from the http request
	var decoder = new StringDecoder('utf-8');

	// Empty string to hold the data coming from the request
	var buffer = '';

	// Append data to buffer as data is coming from the request on data event.
	req.on('data',function(data){
		buffer+=decoder.write(data);
	});

	// Handling the data after it gets end on end event
	req.on('end',function(){
		buffer+=decoder.end();

		// Finding which handler to call after getting the url path
		var choosenHandler = typeof(routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : handlers.notfound;
		
		// Creating data object which is to be send to the handler for manipulation if required 
		var data = {
			'trimmedPath':trimmedPath,
			//'queryStringObject':queryStringObject,
			'method':method,
			//'headers':headers
			'payload':buffer

		};

		// call the handler for the url entered
		choosenHandler(data,function(statusCode,payload){
			// Get the status code and if not provided the set it 200 as default
			statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
			// Get the response payload from the handler that is to be send to the user
			payload = typeof(payload) == 'object' ? payload : {};

			// Stringify the payload because response can not be a object
			payloadString = JSON.stringify(payload);
			// Sending the response with status code  
			res.writeHead(statusCode);
			res.end(payloadString);

			// Logging request in the terminal
			console.log('Returning the response',payload,statusCode);
		});

	});
}

// HTTP server listening on 8080 port
httpServer.listen(8080,function(){
	console.log("HTTP Server running at 8080");
});

// HTTPS server listening on 8081 port
httpsServer.listen(8081,function(){
	console.log("HTTPS Server running at 8081");
});