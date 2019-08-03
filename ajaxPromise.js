/**
* A promise object can register multiple 'then' and 'catch' , a then or catch can return a new promise object with the (thenHandler) return value 
* or catchHandle return value   
* https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/catch
*/

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
  
    promise1.then(function(value) {
    console.log(value);
  });
      promise1.then(function(value) {
    console.log(value);
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

ajaxWithLoading(asyncReq)("data").then(function(result){ console.log(result)}).catch(function(err){console.log(err)});
