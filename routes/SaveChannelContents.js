var UserSavedContentsSchema = require('./DbCollections.js').UserSavedContentsSchema;

exports.SAVEChannelContent4User = function(req,res)
{
    var input = req.body;

    var contentobj = new UserSavedContentsSchema();
    contentobj.userid = input.userid;
    contentobj.locationid= input.locationid;
    contentobj.contenturl = input.contenturl;
    contentobj.Content = [];
    contentobj.Content.push(input.Content);

    //res.send(contentobj);
    

    UserSavedContentsSchema.findOne({ userid:input.userid, locationid:input.locationid, contenturl:input.contenturl},function(error,result)
    	{
    		if(error)
    			res.send({"StatusCode" : "500" ,"Message" : "Internal server error"});             
    		else
    		{
    			if(!result)
    			{
    				contentobj.save(function(err,obj)
			    	{
			    		if(err)
			    			res.send({"StatusCode" : "500" ,"Message" : "Internal server error"});             
			    		else
			    			res.send({"StatusCode" : "200" ,"Message" : "OK"});             
			    	});	
    			}
    			else
    			{
					res.send({"StatusCode" : "200" ,"Message" : "OK"});             
    			}
    		}
    			//res.send('OK');
    	});
}

exports.GetChannelContent4User = function(req,res)
{
    var input = req.body;

    UserSavedContentsSchema.aggregate([
     { $match : { userid : input.userid }},
     { $project : { "contents" : "$Content"}
      },
    ],function(error,result){
      if(error)
            {
              res.send({"result" : "", "StatusCode" : 500 ,"Message" : "Internal server error"});
            }
            else
            {
              res.send({"result" : result , "StatusCode" : 200 ,"Message" : "OK"});
            }
    });
}
