var express=require('express')
var app=express()
var bodyParser = require('body-parser')
var db=require('./db');


// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(function (req, res, next) {

    // Website you wish to allow to connect
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');

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
var users={};
app.get('/details',function(req,res){
  var data=[{'id':1,"name":"Delhi"},
{'id':2,"name":"UP"},
{'id':3,"name":"MP"},
{'id':4,"name":"Maharashtra"}
];
  var states={ data :data};
 //res.end(JSON.stringify(users));
 res.send(states);
})

app.post('/add',function(req,res){

  res.send({data:"yo"});
})

var server=app.listen(8081,function(){
  var host=server.address().address;
  var port=server.address().port;
console.log('Server running at http://127.0.0.1:8081/');
})
