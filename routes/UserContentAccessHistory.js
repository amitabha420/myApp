var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;

exports.getHistory = function (req,res)
{
	var input = req.body;
	var UserId = input.UserId;

	StatContentAccessSchema.find({"userid" : UserId, "deleted" : { $ne: true }},
    {
    	 contentid : "contentid",
         contentName: "contentName",
         contenturl : "contenturl",
         CreateDate : "CreateDate",
         channelid : "channelid",
         contentImageUrl : "contentImageUrl"
    })
    .sort({"CreateDate": -1})
    .limit(50)
    .exec(function(err, docs) {
    	if(err)
            {
                res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
            }
            else
            {
                res.send({"result" : docs, "StatusCode" : "200" ,"Message" : "OK"});             
            }
    })

}



//History is fetching from StatContentAccess Collections. We can not delete it from here. So we are setting it not visible to user.
exports.clearHistory = function(req,res)
{
    var input = req.body;
    var userid = input.userid;

    StatContentAccessSchema.update(
       { "userid": userid },
       { $set: { "deleted" : true } },
       { multi: true },
       function(err,obj)
       {

            if(err)
                res.send({"StatusCode" : "500" ,"Message" : "Internal server error"});
            else
                res.send({"StatusCode" : "200" ,"Message" : "OK"});
   });

}