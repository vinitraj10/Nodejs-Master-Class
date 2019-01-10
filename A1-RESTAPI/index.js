/*
* Primary File for the API
*
*/

// Dependencies
var http = require('http');
var https = require('https');
var url = require('url');
var fs = require('fs');
var StringDecoder = require('string_decoder').StringDecoder;
var config = require('./config');

// Intantiate the http server
var httpServer = http.createServer(function(req,res){
  unifiedServer(req,res);
});

// Start listening on port 3000
httpServer.listen(config.httpPort,function(){
  console.log("Server running on port "+config.httpPort);
});

var httpsServerOptions = {
  'key':fs.readFileSync('./https/key.pem'),
  'cert':fs.readFileSync('./https/cert.pem')
}
// Intantiate the https server
var httpsServer = https.createServer(httpsServerOptions,function(req,res){
  unifiedServer(req,res);
});

httpsServer.listen(config.httpsPort,function(){
  console.log("Server running on port "+config.httpsPort);
});


var unifiedServer = function(req,res){
  // Get the url and parse it
  var parsedUrl = url.parse(req.url,true);

  // Get the path
  var path = parsedUrl.pathname;
  // Deletes the unnecessary '/'
  var trimmedPath = path.replace(/^\/+|\/+$/g,'');

  // Get the queryStrings
  var queryStringObjects = parsedUrl.query;
  // Get the HTTP method
  var method = req.method.toUpperCase();

  // Get request headers
  var headers = req.headers;

  var decoder = new StringDecoder('utf-8');
  var buffer = '';
  req.on('data',function(data){
    buffer+=decoder.write(data);
  });
  req.on('end',function(){
    buffer+=decoder.end();

    // checking whether the url entered exists or not in our routes if not it will go to not found page.
    var choosenHandler = typeof(routes[trimmedPath]) !== 'undefined' ? routes[trimmedPath] : handlers.notFound;
    
    // create data object that is to be send to the handler

    var data = {
      'trimmedPath': trimmedPath,
      'queryStringObjects': queryStringObjects,
      'method': method,
      'headers': headers,
      'payload': buffer
    };
    
    // calling this function will route our request by calling the function which is assinged for this url
    choosenHandler(data,function(statusCode,payload){
      // Use status code from the handler or set default to 200
      statusCode = typeof(statusCode) == 'number' ? statusCode : 200;
      // Use payload from the handler or set default to {}
      payload = typeof(payload) == 'object' ? payload : {};

      // Can't return object as response it must be type of string or buffer
      payloadString = JSON.stringify(payload)
      // Send the response
      res.writeHead(statusCode);
      res.end(payloadString);

      // log the request path
      console.log('Returning the response',payload,statusCode);
    });
  });
}
// Defining handlers
var handlers = {};

// hello handler
handlers.hello = function(data,callback){
  callback(200,{'message':'Successfully done'})
}
// notFound handler
handlers.notFound = function(data,callback){
  callback(404);
}

// Defining routes

var routes = {
  'hello': handlers.hello
}