//step 1) require the modules we need
const
  http = require('http'), //helps with http methods
  path = require('path'), //helps with file paths
  fs = require('fs'), //helps with file system tasks
  mime = require('mime-types');
const PORT = process.env.PORT || 5000;
const { readdirSync } = require('fs');
const getDirectories = source => {
  return readdirSync(source, { withFileTypes: true })
    .filter(item => item.isDirectory()&&item.name[0]!=".")
    .map(item => item.name);
};
    
//a helper function to handle HTTP requests
function requestHandler(req, res) {
  let fileName = path.basename(req.url), //the file that was requested
      localFolder = __dirname, //where our public files are located  
      content = localFolder + "/" + req.url;


  console.log("request url : " + req.url);
  console.log("request filename is : " + fileName);
  console.log("current context dirname is : " + __dirname);
  console.log("content path is : " + content);

  if( ["/","","/index.html"].indexOf(req.url)>=0){
    const directors = getDirectories(localFolder);
    const directorLinks = directors.map( name => `<a href="/${name}/index.html">${name}</a>` );
    const response = 
    `<html>
      <head><title>LABS</title></head>
      <body>
       ${directorLinks.join("<br/>")}
      </body>
    </html>`;
    res.writeHead(200, {
      'Content-Type': 'text/html'
    });
    res.end(response);
  };
  //NOTE: __dirname returns the root folder that
  //this javascript file is in.

  fs.exists(content, function (exists) {
    if (exists) {
      // Do something
      fs.readFile(content, function (err, contents) {
        //if the fileRead was successful...
        if (!err) {
          //send the contents of index.html
          //and then close the request
          res.writeHead(200, {
            'Content-Type': mime.lookup(content)
          });
          res.end(contents);
        } else {
          //otherwise, let us inspect the eror
          //in the console
          console.dir(err);
        };
      });
    } else {
      //if the file was not found, set a 404 header...
      res.writeHead(404, {
        'Content-Type': 'text/html'
      });
      //send a custom 'file not found' message
      //and then close the request
      res.end('<h1>Sorry, the page you are looking for cannot be found.</h1>');
    }
  });
};


http.createServer(requestHandler).listen(PORT);
console.log(`start web server at port ${PORT}`);