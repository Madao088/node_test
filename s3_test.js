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
    "secretAccessKey": 'config.s3_secretAccessKey',
    "region": config.s3_region
  }
var s3 = new aws.S3();
var myBucket = 'madairtest';

router.post('/upload/',upload.any(),function(req,res,next){

    var file=req.files[0];
    Object.keys(req.files).forEach(function(key){
        var file=req.files[key];
        var stream = fs.createReadStream(file.path);
             params = {Bucket: 'madairtest', Key:file.filename, Body: stream};
        
             s3.putObject(params, function(err, data) {
        
                 if (err) {
                    console.log("called");
                    return next(err);
        
                 } else {
        
                    res.status(200).json(results);
        
                 }
        
              });
                });
    
})




module.exports = router;