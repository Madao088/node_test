var express=require('express');
var router=express.Router();
var conn=require('./db');
var mongodb=require('./mongodb.js');

router.get("/users",function(req,res){
    var result=[];
    var sql="select u.*,technology,s.name as state from users as u left join states as s on u.state_id=s.id left join user_techs as ut on u.user_id=ut.user_id left join technologies as t on ut.tech_id=t.id";
   var query=conn.query(sql,function(err,row){
        if(err)
            res.status(500).json({message:"failed"});
        else {
            var u_id=-1;
            var i=0;
            var tech=[];
            
            row.forEach((val)=>{
                if(u_id==val.user_id){
                    tech.push(val.technology);
                    row[i].tech=tech;
                    delete row[i-1];
                    delete val["technology"];
                }
                else{
                    tech=[];
                    tech.push(val.technology);
                    row[i].tech=tech;
                    delete val["technology"];
                    u_id=val.user_id;
                    result.push(row[i]);
                }
                i++;
            })
            result.forEach(function(res){
                delete(res['user_id']);
                db.collection('users').save(res,(err,result)=>{
                    if (err) return console.log(err)
                        console.log('saved to database')
                })
            })
            res.status(200).json(result);
        }
            
    })  
})

router.get('/states',function(req,res){
    var result=[];
    conn.query('select * from states',function(err,result){
        if (err)
           result.status(500).json({message:"failed"});
        else{
            result.forEach(function(result){
                db.collection("states").save(result,function(err,res){
                 if (err) return console.log(err)
                    else
                        console.log("saved");
            });
            })

            res.status(200).json(result);    
           
        }
            
    })
  
});

router.get('/techs',function(req,res){
    var result=[];
    conn.query('select * from technologies',function(err,result){
        if (err)
           result.status(500).json({message:"failed"});
        else{
            result.forEach(function(result){
                db.collection("technologies").save(result,function(err,res){
                 if (err) return console.log(err)
                    else
                        console.log("saved");
            });
            })

            res.status(200).json(result);    
           
        }
    })
  
});
module.exports=router;