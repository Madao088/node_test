var express=require("express");
var router=express.Router();
var conn=require('./db')
var mysql=require('mysql');


router.get('/',function(req,res){
    var str="";
    var result=[];
    if(req.query.perPage!=undefined){
        str+=" limit "+req.query.perPage;
        if(req.query.offset!=undefined)
            str+=" offset "+req.query.offset;}
        console.log(conn);
     var sql="select u.*,technology,s.name as state from users as u left join states as s on u.state_id=s.id left join user_techs as ut on u.user_id=ut.user_id left join technologies as t on ut.tech_id=t.id"+str;
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

            res.status(200).json(result);
        }
            
    })  
    console.log(query.sql);
  
});

router.get('/test',function(req,res){
    var str="";
    var result=[];
    if(req.query.perPage!=undefined){
        str+=" limit "+req.query.perPage;
        if(req.query.offset!=undefined)
            str+=" offset "+req.query.offset;}
     var sql="select * from users order by user_id asc"+str;
   var query=conn.query(sql,function(err,row){
       result=row;
        if(err)
            res.status(500).json({message:"failed"});
        else {
            var sql="select count(*) as total from users";
            conn.query(sql,function(err,row){
                if(err)
                    res.status(500).json({message:"failed"});
                else{
                    res.status(200).json({data:result,total:row[0].total});
                }
            })
            
        }
            
    })  
  
});

router.get('/states',function(req,res){
    var result=[];
    conn.query('select * from states',function(err,row){
        if (err)
           res.status(500).json({message:"failed"});
        else
            res.status(200).json(row);
    })
  
});

router.get('/techs',function(req,res){
    var result=[];
    conn.query('select * from technologies',function(err,row){
        if (err)
           res.status(500).json({message:"failed"});
        else
            res.status(200).json(row);
    })
  
});

router.get('/:id',function(req,res){
    
    var sql="select u.*,tech_id,s.name as state from users as u left join states as s on u.state_id=s.id left join user_techs as ut on u.user_id=ut.user_id where u.user_id=?";
   var query=conn.query(sql,req.params.id,function(err,row){
        if(err)
            res.status(500).json({message:"failed"});
        else {
            var tech=[];
            row.forEach((val)=>{
                tech.push(val.tech_id);
                delete val.tech_id;
            })
            row[0].tech=tech;
            res.status(200).json(row[0]);
        }
            
    })  
});

router.post('/',function(req,res){
    var form=req.body.data;
    var sql=("insert into users (name,email,address,gender,state_id) values ?");
    var values=[[form.name,form.email,form.address,form.gender,form.state]];
    var id;
   var query= conn.query(sql,[values],function(err,rows){
        if(err)
            res.status(500).json({message:"failed"});
        else{
            
            id=String(rows.insertId);
            if(form.tech && form.tech.length>0){
        var values=[];
            form.tech.forEach(function(x){
                    var val=[id,x];
                    values.push(val);
            })
            var sql=("insert into user_techs (user_id,tech_id) values ?");
            var query=conn.query(sql,[values],function(err,row){
                    if(err)
                        res.status(500).json({message:"failed"});
                    else
                        res.status(200).json({message:"success"});
            })
                
        } else
         res.status(200).json({message:"success"});
        }
    })
    
    
});

router.delete('/:id',function(req,res){
    id=req.params.id;
    sql="delete from users where user_id=?";
    conn.query(sql,id,function(err,row){
            if(err)
                res.status(500).json({message:"failed"});
            else
                res.status(200).json({message:"success"});
    })
})

router.put('/:id',function(req,res){
      var form=req.body.data;
    var sql=("update users set name=?,email=?,address=?,gender=?,state_id=? where user_id="+req.params.id);
    var values=[form.name,form.email,form.address,form.gender,form.state];
    var id;
   var query= conn.query(sql,[form.name,form.email,form.address,form.gender,form.state],function(err,rows){
        if(err){
            res.status(500).json({message:"fail"});
        }else{
            if(form.tech && form.tech.length>0){
        var values=[];
            form.tech.forEach(function(x){
                    var val=[req.params.id,x];
                    values.push(val);
            })
                var sql=("delete from user_techs where user_id=?");
            var query=conn.query(sql,req.params.id,function(err,row){
                    if(err)
                        res.status(500).json({message:"failed"});
                    else
                        res.status(200).json({message:"success"});
            })
            var sql=("insert into user_techs (user_id,tech_id) values ?");
            var query=conn.query(sql,[values],function(err,row){
                    if(err)
                        console.log("error");
                    else
                        console.log("fine");
            })
               
        } else
         res.status(200).json({message:"success"});
        }
    })
    
})

module.exports = router;