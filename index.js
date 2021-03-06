var express=require("express");
var app=express();
var bodyParser = require('body-parser')
var config = require('./config.js');
var users=require('./users.js');
var mongo_users=require('./mongo_users.js');
var convert=require('./mysqltomongo.js');
var mongodb=require('./mongodb.js');
var winston = require('winston');
var test=require('./s3_test.js');

// parse application/x-www-form-urlencoded

var logger = new (winston.Logger)({
  transports: [
    new (winston.transports.File)({
      name: 'info-file',
      filename: 'filelog-info.log',
      level: 'info'
    }),
    new (winston.transports.File)({
      name: 'error-file',
      filename: 'filelog-error.log',
      level: 'error'
    })
  ]
});
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', '*');

    // Request methods you wish to allow
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    res.setHeader('Access-Control-Allow-Credentials', true);

    // Pass to next layer of middleware
    next();
});

app.use('/convert', convert);
app.use('/users', users);
app.use('/mongo_users', mongo_users);
app.use('/test', test);
// app.all('*', function(req, res) {
//     return next({msg:"invalid request"}});
// })
app.use(function (err, req, res, next) {
  /* We log the error internaly */
  if(err.statusCode&&err.statusCode==200){
    console.log("here");
      logger.info(err);
      res.status(err.statusCode).json(err.data);
      }
  else{
    console.log("there");
      logger.error(err);
     res.status(err.statusCode || 500).json(err.msg||"server error");
  }
      
    
	/*
     * Remove Error's `stack` property. We don't want
     * users to see this at the production env
     */
    // if (req.app.get('env') !== 'development') {
    //     delete err.stack;
    // }

	/* Finaly respond to the request */
   
});






app.listen(3000,function(){
  console.log('Server running at http://127.0.0.1:3000/');
});