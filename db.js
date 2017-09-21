var mysql=require('mysql');

var conn=mysql.createConnection({
    host:'127.0.0.1',
    user:'root',
    password:'scherzinger',
    db:'test'
});

conn.connect(function(err){
    if(err)
        throw err;
    conn.query('use test');
});

module.exports=conn;