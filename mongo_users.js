var express=require('express');
var router=express.Router();
var mongodb=require('./mongodb.js');
var ObjectId = require('mongodb').ObjectID;
router.get('/',function(req,res){
    db.collection("users").find().toArray(function(err, results) {
        if (err){
            res.statusMessage = "Server Error";
            res.status(500).end();
        }
        else
            res.status(200).json(results);
    });

})



router.get('/states',function(req,res){

    db.collection("states").find().toArray(function(err, results) {
        if (err){
            res.statusMessage = "Server Error";
             res.status(500).end();
        }
        else
            res.status(200).json(results);
    });

})

router.get('/techs',function(req,res){
    db.collection("technologies").find().toArray(function(err, results) {
        if (err){
            res.statusMessage = "Server Error";
             res.status(500).end();
        }
        else
            res.status(200).json(results);
    });

})

router.get('/:id',function(req,res){
    id=req.params.id;
    db.collection("users").findOne({"_id": ObjectId(id)},function(err, results) {
        if (err){
            res.statusMessage="User does not exist";
            res.status(404).end();
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
         res.statusMessage = "Name Required";
         res.status(412).end();
    }else if(!req.body.data.email){
         res.statusMessage = "Email Required";
         res.status(412).end();
    }else if(!req.body.data.address){
         res.statusMessage = "Address Required";
         res.status(412).end();
    }else if(!req.body.data.gender){
         res.statusMessage = "Gender Required";
         res.status(412).end();
    }else if(!req.body.data.state){
         res.statusMessage = "State Required";
         res.status(412).end();
    }else if(validateEmail(req.body.data.email)==false){
        res.statusMessage = "Email incorrect";
         res.status(412).end();
    }else{
        db.collection("users").findOne({"email":req.body.data.email},function(err,row){
            console.log
            if (row==null){
                db.collection("users").save(req.body.data,function(err,result){
                        if (err){
                            res.statusMessage = "Server Error";
                            res.status(500).end();
                        }else
                            res.status(200).json({"message":"success"});
                        
                    })
            }
                else{
                    res.statusMessage="Email already exists";
                    res.status(412).end();
                }
        });
    }
});

router.delete('/:id',function(req,res){
    id=req.params.id;
    db.collection("users").remove({"_id": ObjectId(id)},function(err,result){
        if(err){
            res.statusMessage="User does not exist";
            res.status(404).end();
        }else
            res.status(200).json({"message":"success"});
    });
})

router.put('/:id',function(req,res){
    id=req.params.id;
    req.body.data._id=ObjectId(id);
    db.collection("users").save(req.body.data,function(err,result){
        if(err){
            res.statusMessage="Server Error";
            res.status(500).end();
        }else
            res.status(200).json({"message":"success"});
    });
})

module.exports = router;