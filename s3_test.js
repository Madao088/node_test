var express=require('express');
var router=express.Router();
var multer  = require('multer')
var upload = multer({ dest: './uploads/'});
var fs= require('file-system');

// S3FS = require('s3fs'),
// s3fsImpl = new S3FS('madairtest', {
//     accessKeyId: 'AKIAILVP3GT7PGOULCYA',
//     secretAccessKey: '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',
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
aws.config.loadFromPath('./AwsConfig.json');
var s3 = new aws.S3();
var myBucket = 'madairtest';

router.post('/upload/',upload.any(),function(req,res,next){

    var file=req.files[0];
    var stream = fs.createReadStream(file.path);
        console.log(file);
             params = {Bucket: 'madairtest', Key:file.filename, Body: stream};
        
             s3.putObject(params, function(err, data) {
        
                 if (err) {
        
                     console.log(err)
        
                 } else {
        
                     console.log(data);
        
                 }
        
              });
})




module.exports = router;