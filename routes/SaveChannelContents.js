var UserSavedContentsSchema = require('./DbCollections.js').UserSavedContentsSchema;

exports.SAVEChannelContent4User = function(req,res)
{
    var input = req.body;

    

    var contentobj = new UserSavedContentsSchema();
    contentobj.userid = input.userid;
    contentobj.locationid= input.locationid;
    contentobj.contenturl = input.contenturl;
    contentobj.contentid = input.contentid;
    contentobj.locationName = input.locationName;
    contentobj.lat = input.lat;
    contentobj.lng = input.lng;
    contentobj.EndingTime = input.EndingTime;
    contentobj.StartingTime = input.StartingTime;
    contentobj.ImageUrl = input.ImageUrl;
    contentobj.Type = input.Type;
    contentobj.Name = input.Name;
    contentobj.ChannelId = input.ChannelId;
    contentobj.ChannelName = input.ChannelName;

    //console.log(input.contentid);
    //var target1 = "http:\/\/storage.googleapis.com\/0syncspotteam-bucket01\/Vdieo_635605735016179351.mp4";
    //var target = target1.replace('s', '');
    //console.log(contentobj.contenturl);
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
     { 
        $match : { userid : input.userid }
     },
     { $group : 
        {
            _id :
                {
                    lat : "$lat", 
                    lng : "$lng", 
                    locationName : "$locationName",
                    locationid : "$locationid",
                    ChannelId:"$ChannelId" ,
                    ChannelName:"$ChannelName"
                },
       
                    "content" : {"$push" : 
                                    {
                                        "contentid" : "$contentid",
                                        "contenturl" : "$contenturl",
                                        "Type" : "$Type",
                                        "StartingTime" : "$StartingTime",
                                        "EndingTime" : "$EndingTime",
                                        "ImageUrl" :  "$ImageUrl",
                                        "Name" : "$Name",

                                    }
                                }
        }
    },
    { $project : 
        {
            Content : "$content",
            lat:"$_id.lat",
            lan:"$_id.lng",
            locationName:"$_id.locationName",
            locationid:"$_id.locationid",
            ChannelId:"$_id.ChannelId" ,
            ChannelName:"$_id.ChannelName",
            _id:0
        }
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

exports.ClearChannelContent4User = function(req,res)
{
    var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;

    var userid = input.userid;
    var contentid = input.contentid;
    

    if(contentid == undefined || contentid === '') //multiple delete
    {
        
        
        UserSavedContentsSchema.remove({"userid" : userid},function(err,obj){
           //console.log(JSON.stringify(obj));
           // console.log(err);
            if(err)
                res.send({"StatusCode" : 500 ,"Message" : "Internal server error"});
            else
                res.send({"StatusCode" : 200 ,"Message" : "OK"});
        })
        
    }
    else //single delete
    {
         UserSavedContentsSchema.remove({"_id" : ObjectId(contentid)},function(err,obj){
            if(err)
                res.send({"StatusCode" : 500 ,"Message" : "Internal server error"});
            else
                res.send({"StatusCode" : 200 ,"Message" : "OK"});
        })
    }

}