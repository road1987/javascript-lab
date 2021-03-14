//step 1) require the modules we need
var
http = require('http'),//helps with http methods
path = require('path'),//helps with file paths
fs = require('fs');//helps with file system tasks
const PORT = process.env.PORT || 5000;

//a helper function to handle HTTP requests
function requestHandler(req, res) {
    var
    fileName =  path.basename(req.url),//the file that was requested
    localFolder = __dirname,//where our public files are located  
    content = localFolder  + "/" +  req.url;
 

    console.log("request url : " + req.url);
    console.log("request filename is : " + fileName);
    console.log("current context dirname is : " + __dirname);
    console.log("content path is : " + content);
            

    //NOTE: __dirname returns the root folder that
    //this javascript file is in.

     fs.exists(content, function(exists) {
        if (exists) {
            // Do something
          fs.readFile(content,function(err,contents){
            //if the fileRead was successful...
            if(!err){
                //send the contents of index.html
                //and then close the request
                res.end(contents);
            } else {
                //otherwise, let us inspect the eror
                //in the console
                console.dir(err);
            };
          });
        } else {
          //if the file was not found, set a 404 header...
          res.writeHead(404, {'Content-Type': 'text/html'});
          //send a custom 'file not found' message
          //and then close the request
          res.end('<h1>Sorry, the page you are looking for cannot be found.</h1>');
        }
    });
};
 

http.createServer(requestHandler).listen(PORT);
console.log(`start web server at port ${PORT}`);