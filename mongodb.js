const MongoClient = require('mongodb').MongoClient
const config = require('./config');

var url="mongodb://"+config.user+":"+config.password+"@localhost:27017/"+config.db;
//var url="mongodb://admin:scherzinger@localhost:27017/test"
var conn=MongoClient.connect(url, (err, database) => {
 db=database;
 console.log("connected");
 db.collection("users").ensureIndex({email:1});
})

module.exports=conn;