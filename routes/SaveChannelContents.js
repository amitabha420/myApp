var UserSavedContentsSchema = require('./DbCollections.js').UserSavedContentsSchema;

exports.SAVEChannelContent4User = function(req,res)
{
    var input = req.body;

    var contentobj = new UserSavedContentsSchema();
    contentobj.userid = input.userid;
    contentobj.locationid= input.locationid;
    contentobj.contenturl = input.contenturl;
    contentobj.locationName = input.locationName;
    contentobj.lat = input.lat;
    contentobj.lng = input.lng;
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
     { $group : {_id :{lat : "$lat", lng : "$lng", locationName : "$locationName" ,locationid : "$locationid" },
                 "Content" : {"$push" :"$Content"}}},
     { $project : {Content : "$Content",lat:"$_id.lat",lan:"$_id.lng",locationName:"$_id.locationName",locationid:"$_id.locationid",_id:0}},
   
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