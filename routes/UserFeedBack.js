var FeedBackSchema = require('./DbCollections.js').FeedBackSchema;


/* Input
{
  "topic" : "test",
  "message" : "test",
  "userid" : "dsfcdsadaas"
}
*/
//need to add admin user user name validation.
exports.Create = function(req,res)
{
    var obj = req.body;

    //console.log(obj.User + ',' + obj.password);
    var userFeedBack = new FeedBackSchema();
    userFeedBack.topic = obj.topic;
    userFeedBack.message = obj.message;
    userFeedBack.userid = obj.userid;

    userFeedBack.save(function (err, result) {
        if (err) 
        {
            console.log(err);// ...
            res.send({"result" : "" , "StatusCode" : "500","Message" : "Internal server error"});
           
        }

        var responseObj = {"result" : result , "StatusCode" : "200", "Message" : "OK"};
        res.send(responseObj);
    });
}
