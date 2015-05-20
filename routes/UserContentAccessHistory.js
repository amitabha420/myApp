var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;

exports.getHistory = function (req,res)
{
	var input = req.body;
	var UserId = input.UserId;

	StatContentAccessSchema.find({"userid" : UserId},
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