var express=require('express');
var router=express.Router();

router.get('/',function(req,res){
    session.run('MATCH (a:users)').then((result) => {
    driver.close();

}).catch(error => {
    console.log(error);
    driver.close();

})

})