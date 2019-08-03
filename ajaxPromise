var asyncReq = function( data){
  var promise1 = new Promise(function(resolve, reject) {
    console.log("execute....");
    if(data){
      setTimeout(function(){
      	resolve(data);
      },2000);
    }else{
      setTimeout(function(){
      	reject('Uh-oh!');
      },2000);
    	//throw new Error("this is a error");
    }
    
  });

  promise1.catch(function(error) {
    console.log("first catch : " + error);
  });
  promise1.catch(function(error) {
    console.log("second catch : " + error);
  });
  return promise1;
}
// expected output: Uh-oh!
function ajaxWithLoading( promiseFun ){
	return function(){
      console.log("busyIndicate start...");
      return promiseFun
        .apply(null, arguments)
        .then(function(data){ console.log('busyIndicate end......');return data;}).catch(function(err){
          console.log("busyIndicate end...... catch");
          throw err;
        });
        
    }
}

ajaxWithLoading(asyncReq)("").then(function(result){ console.log(result)}).catch(function(err){console.log(err)});
