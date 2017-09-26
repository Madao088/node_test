var express=require('express');
var router=express.Router();
var ObjectId = require('mongodb').ObjectID;

// winston.add(winston.transports.File, { filename: 'mylogfile.log', level: 'silly' });



router.get('/',function(req,res){
    //logger.log('error', 'test message %s', 'my string');
    
    db.collection("users").find().toArray(function(err, results) {
        if (err){
            return next({message : "Server Error"});
        }
        else
            res.status(200).json(results);
    });

})

router.get('/test/:id',function(req,res,next){
    id=req.params.id;
    console.log(id);
    return next({statusCode : 412, message : "too lazy to implement"});
})

router.get('/states',function(req,res){

    db.collection("states").find().toArray(function(err, results) {
        if (err){
            return next({message : "Server Error"});
        }
        else
            res.status(200).json(results);
    });

})

router.get('/techs',function(req,res){
    db.collection("technologies").find().toArray(function(err, results) {
        if (err){
            return next({message : "Server Error"});
        }
        else
            res.status(200).json(results);
    });

})

router.get('/:id',function(req,res){
    id=req.params.id;
    db.collection("users").findOne({"_id": ObjectId(id)},function(err, results) {
        if (err){
            return next({statusCode:404,message : "User does not exist"});
        }
        else
            res.status(200).json(results);
    });

})
function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}
router.post('/',function(req,res){
    // console.log(req.body.data);
    // Object.keys(req.body.data).forEach(function(key){
    //             if(req.body.data[key]==)
    //                 console.log(key);
    //             else{
    //                 console.log("no");
    //                 // res.statusMessage = key+"Required";
    //                 // res.status(412).end();
    //             }
    //         });
    if(!req.body.data.name){
        return next({statusCode:412,message : "Name Required"});
    }else if(!req.body.data.email){
        return next({statusCode:412,message : "Email Required"});
    }else if(!req.body.data.address){
        return next({statusCode:412,message : "Address Required"});
    }else if(!req.body.data.gender){
        return next({statusCode:412,message : "Gender Required"});
    }else if(!req.body.data.state){
        return next({statusCode:412,message : "State Required"});
    }else if(validateEmail(req.body.data.email)==false){
        return next({statusCode:412,message : "Email Incorrect"});
    }else{
        db.collection("users").findOne({"email":req.body.data.email},function(err,row){
            console.log
            if (row==null){
                db.collection("users").save(req.body.data,function(err,result){
                        if (err){
                            return next({message : "Server Error"});
                        }else
                            res.status(200).json({"message":"success"});
                        
                    })
            }
                else{
                    return next({statusCode:412,message : "Email Already Exists"});
                }
        });
    }
});

router.delete('/:id',function(req,res){
    id=req.params.id;
    db.collection("users").remove({"_id": ObjectId(id)},function(err,result){
        if(err){
            return next({statusCode:404,message : "User Does not Exist"});
        }else
            res.status(200).json({"message":"success"});
    });
})

router.put('/:id',function(req,res){
    id=req.params.id;
    req.body.data._id=ObjectId(id);
    db.collection("users").save(req.body.data,function(err,result){
        if(err){
            return next({message : "Server Error"});
        }else
            res.status(200).json({"message":"success"});
    });
})

router.post('/bulk_state',function(req,res){

    var batch = db.collection('states').initializeUnorderedBulkOp();
    req.body.data.forEach(function(state){
        batch.find( { name: state.name } ).upsert().updateOne(
             {
                 name:state.name
                }
            );
    })
    batch.execute();
    res.status(200).json({"message":"success"});
})

module.exports = router;