var express=require('express');
var router=express.Router();
var multer  = require('multer')
var upload = multer({ dest: './uploads/'});
var fs= require('file-system');
const config = require('./config');

// S3FS = require('s3fs'),
// s3fsImpl = new S3FS('madairtest', {
//     accessKeyId: '',
//     secretAccessKey: '+',
//     region:'ap-south-1'
// });

// // Create our bucket if it doesn't exist
// //s3fsImpl.create();
// router.post('/upload/',upload.any(),function(req,res,next){

//     var file=req.files[0];
//     var stream = fs.createReadStream(file.path);
//     console.log(file);
//     console.log(stream);
//     s3fsImpl.writeFile(file.originalFilename, stream).then(function () {
//         fs.unlink(file.path, function (err) {
//             if (err) {
//                 console.error(err);
//             }
//         });
//         res.status(200).end();
//     });
// })
var aws = require('aws-sdk');
//aws.config.loadFromPath('./AwsConfig.json');
aws.config={
    "accessKeyId": config.s3_accessKeyId,
    "secretAccessKey": config.s3_secretAccessKey,
    "region": config.s3_region
  }
var s3 = new aws.S3();
var myBucket = 'madairtest';

router.post('/upload/',upload.any(),function(req,res,next){
    console.log("called");
    Object.keys(req.files).forEach(function(key){
        var file=req.files[key];
        var stream = fs.createReadStream(file.path);
             params = {Bucket: 'madairtest', Key:file.filename, Body: stream};
        
             s3.putObject(params, function(err, data) {
        
                 if (err) {
                    return next(err);
        
                 } else {
                     db.collection("files").save({url:'https://s3.ap-south-1.amazonaws.com/madairtest/'+file.filename},function(err,result){
                        if (err){
                            return next(err);
                        }else
                            return next({statusCode:200,data:{title:'file added to S3',message:'success'}});
                        
                    })
        
                 }
        
              });
                });
    
})

router.get('/:id',function(req,res,next){
    console.log(req.params.id);
     params = {Bucket: 'madairtest', Key:req.params.id};
    s3.deleteObject(params, function (err, data) {
        if (data) {
            console.log("hee");
            db.collection("files").remove({url:'https://s3.ap-south-1.amazonaws.com/madairtest/'+req.params.id},function(err,result){
                if(err){
                    return next({statusCode:404,msg : "File Does not Exist"});
                }else
                    return next({statusCode:200,data:{title:'file deleted',message:'success'}});
            });
            
        }
        else {
            console.log("thee");
            return next(err);
        }
    });
})




module.exports = router;