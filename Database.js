
///////////////////////////////////////////////////
//This block is to get the server up and running///
///////////////////////////////////////////////////
var USE_DB = false;
var mongojs = USE_DB ? require("mongojs"): null;
var db = USE_DB ? mongojs('localhost:27017/myGame', ['account','progress']) : null;


Database = {};

Database.isValidPassword = function(data,cb){
  if (!USE_DB){
  return cb(true);
}
else {
db.account.find({username:data.username,password:data.password},function(err,res){
  if(res.length > 0){
    cb(true);
  }else{
      cb(false);
    }
});
}
}

Database.isUsernameTaken = function(data,cb){
if (!USE_DB){
  return cb(false);
}
else{
  db.account.find({username:data.username},function(err,res){
    if(res.length > 0){
      cb(true);
    }else{
        cb(false);
      }
  });
}
}
Database.addUser = function(data,cb){
if (!USE_DB){
  return cb();
}
else{
  db.account.insert({username:data.username,password:data.password},function(err){
      cb();
  });
}
}
