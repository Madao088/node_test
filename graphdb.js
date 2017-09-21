console.log("yo");
 var neo4j = require('neo4j-driver').v1;
 
var driver = neo4j.driver("bolt://localhost:7687", neo4j.auth.basic("neo4j", "scherzinger"));
const session = driver.session();
session.run('CREATE (a:users{name:"UP"}),(b:states{name:"Delhi"}),(c:states{name:"MP"}),(d:states{name:"Gujarat"})').then((result) => {
    driver.close();

}).catch(error => {
    console.log(error);
    driver.close();

})
