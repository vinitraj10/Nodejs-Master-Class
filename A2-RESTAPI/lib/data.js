/*
 * Library for storing and updating data
 *
 */

// Dependencies
var fs = require('fs');
var path = require('path');

// Container for the module to be exported
var lib = {};

// Base Directory for the folder
lib.baseDir = path.join(__dirname,'/../.data/');
// Writing data to a file
lib.create = function(dir,file,data,callback){
	// Open the file for writing
	fs.open(lib.baseDir+dir+'/'+file+'.json','wx',function(err,fileDescriptor){
		if(!err && fileDescriptor){
			// Convert data to the string
			var stringData = JSON.stringify(data);

			// Write to file and close it
			fs.writeFile(fileDescriptor,stringData,function(err){
				if(!err){
					fs.close(fileDescriptor,function(err){
						if(!err){
							callback(false);
						} else {
							callback('Error closing the new file');
						}
					});
				} else {
					callback('Error writing to the new file');
				}
			});
		} else {
			callback('Could not create a new file,it may already exists');
		}
	});
};

// Read the data from the file
lib.read = function(dir,file,callback){
	fs.readFile(lib.baseDir+dir+'/'+file+'.json','utf-8',function(err,data){
		callback(err,data);
	});
}

// Update the data of the file
lib.update = function(dir,file,data,callback){
	// Open the file for writing 
	var _path = path.join(lib.baseDir,dir,file)+'.json';
	console.log(_path);
	fs.open(_path,'r+',function(err,fileDescriptor){
		if(!err && fileDescriptor) {
			// Converting the data to string
			var stringData = JSON.stringify(data);
			// Truncate the file
			fs.ftruncate(fileDescriptor,function(err){
				if(!err){
					// Write the file and close it
					fs.writeFile(fileDescriptor,stringData,function(err){
						console.log(stringData,fileDescriptor,err);
						if(!err) {
							fs.close(fileDescriptor,function(err){
								if(!err){
									callback(false);
								} else {
									callback('Error in closing the file');
								}
							});							
						} else {
							//console.log(err);
							callback('Error in writing the existing file');
						}
					});
				} else {
					console.log(err);
					callback('Error in truncating the file');
				}
			});
		} else {
			console.log(err);						
			callback("Could not open the file for updating,it may not exists yet");
		}
	});
}



// Export the module
module.exports = lib;