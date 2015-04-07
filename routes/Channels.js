var adminUsersSchema = require('./DbCollections.js').AdminUsersSchema;
var async = require('async');


//Create channel
    
//Input data
/*{
  "_userid": "551d0aa75e297dec2204bd58",  //admin user id
  "ChannelName" : "channel2",
  "ChannelDescription" : "ChannelDescription",
  "BannerImageUrl" : "BannerImageUrl"
        
  }*/
exports.Create = function(req,res)
{
    var AdminUser = req.body;

    var StatusCode = 200;
    var Message = "";
    var AdminUserDbObject ;

    if(!AdminUser.BannerImageUrl)
        {
            AdminUser.BannerImageUrl = "http://syncspot.net/wp-content/uploads/2014/12/SyncSpot-Logo-V2.png";
        }

    //200 : OK
    //201 : Channel already exists for the user.
    //404 : Data is not valid.
    //500 : Internal server error.

    async.series([
        
        function(callback) {

            adminUsersSchema.findOne({ _id: AdminUser._userid }, function(err,obj) 
            {
                //console.log(JSON.stringify(obj));
                if(err)
                {
                    console.log(err);
                    StatusCode = 500;
                    Message = "Internal server error";
                }
                else
                {
                    if(obj != null )
                    {
                    	if(obj.Channel.length == 0)
                    	{
                    		obj.Channel	= [];		
                    	}
                    	else //checking for duplicate name
                    	{
                    		 for(var i=0;i<obj.Channel.length;i++)
                    		  {
        						if (obj.Channel[i].ChannelName === AdminUser.ChannelName)
        						{
                                    StatusCode = 201;
                                    Message = "Channel already exists for the user.";
        						}
    						  }
                    	}
                        //assign the retrieved object to the variable AdminUserDbObject used to save the channel
                        AdminUserDbObject = obj;
                    }
                    else
                    {
                        StatusCode = 404;
                        Message = "Data is not valid";
                    }
                }
                callback();
            })
            
        }, //1st function end

        ], //end of function serize
            function(err) { //This function gets called after the two tasks have called their "task callbacks"
            
            if(StatusCode == 500)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
            }
            else if(StatusCode == 201)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
            }
            else if(StatusCode == 404)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
            }
            else
            {
                AdminUserDbObject.Channel.push(
                                {
                                    "ChannelName" : AdminUser.ChannelName,
                                    "ChannelDescription" : AdminUser.ChannelDescription,
                                    "BannerImageUrl" : AdminUser.BannerImageUrl
                                });
                        AdminUserDbObject.save(function(err,finalobj){
                            if(err)
                            {
                                StatusCode = 500;
                                Message = "Internal server error";
                                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
                            }
                            else
                            {
                                var channelcount = finalobj.Channel.length;
                                var channelid = finalobj.Channel[channelcount - 1]._id;
                                StatusCode = 200;
                                Message = "OK";
                                res.send({"_id" : channelid, "StatusCode" : StatusCode ,"Message" : Message});
                            }
                        });
            }
        })
}


//Edit channel
//Input data
/* 
    {
   "_userid": "551d0aa75e297dec2204bd58",
  "ChannelName" : "channel3",
  "ChannelDescription" : "this is changed",
  "BannerImageUrl" : "BannerImageUrl"
        
    }
*/
exports.Edit = function(req,res){

    //200 : OK
    //404 : Data is not valid.
    //500 : Internal server error.

    var AdminUser = req.body;
    adminUsersSchema.update(
                                { _id: AdminUser._userid, "Channel.ChannelName": AdminUser.ChannelName },
                                       { $set: { 
                                                "Channel.$.ChannelDescription" : AdminUser.ChannelDescription ,
                                                "Channel.$.BannerImageUrl" : AdminUser.BannerImageUrl 
                                               } 
                                }
                            ).exec(function(err,obj)
                                    {
                                        if(err)
                                        {
                                            res.send({"_id" : "", "StatusCode" : 500 ,"Message" : "Internal server error"});
                                        }
                                        else
                                        {
                                            if(obj == 1)
                                            {
                                                res.send({"_id" : "", "StatusCode" : 200 ,"Message" : "OK"});
                                            }
                                            else
                                            {
                                                res.send({"_id" : "", "StatusCode" : 404 ,"Message" : "Data is not valid"});
                                            }    
                                        }
                                    });
}



//Delete a particular channel
//Not Working
/* Input data
    {
        "_userid": "551d0aa75e297dec2204bd58",
        "ChannelName" : "channel1"
    }
*/
exports.Delete = function(req,res)
{
    //200 : OK
    //404 : Data is not valid.
    //500 : Internal server error.

    var AdminUser = req.body;
    console.log(AdminUser.ChannelName);
    adminUsersSchema.update( 
                                { _id: AdminUser._userid }, 
                                { $pull: 
                                    { 
                                        "AdminUsers.Channel" : 
                                                                { 
                                                                    'ChannelName' : AdminUser.ChannelName
                                                                } 
                                    } 
                                } 
                                //false
                            )
                    .exec(function(err,obj)
                          {
                            if(err)
                            {
                                console.log(err);
                                res.send({"_id" : "", "StatusCode" : 500 ,"Message" : "Internal server error"});
                            }
                            else
                            {
                                console.log(obj);
                                if(obj == 1)
                                {
                                    res.send({"_id" : "", "StatusCode" : 200 ,"Message" : "OK"});
                                }
                                else
                                {
                                    res.send({"_id" : "", "StatusCode" : 404 ,"Message" : "Data is not valid"});
                                }    
                            }
                          });
}



/* Input Data
{
   "_userid": "551d0aa75e297dec2204bd58",
   "ChannelName" : "channel1",     
   "Coordinates" :[ [30.30532,72.6416],[28.99313,70.30151],[30.78517,70.44434]],
  "Digitalcontents" : [ "http://storage.googleapis.com/0syncspotteam-bucket01/Kalimba.mp3",
                        "http://storage.googleapis.com/0syncspotteam-bucket01/beautiful-nature-1411.jpg",
                        "http://storage.googleapis.com/0syncspotteam-bucket01/Chrysanthemum.jpg",
                        "http://storage.googleapis.com/0syncspotteam-bucket01/Hydrangeas.jpg",
                        "http://storage.googleapis.com/0syncspotteam-bucket01/Desert.jpg"
                      ],
   "LocationName" : "India"
}
*/

//same location name validation required for a channel
exports.UploadDigitalContent = function(req,res)
{
    var RequestData = req.body;
    var AdminUserDbObject;
    var DigitalContents= [];
    var StatusCode = 200;
    var Message = "";

    for (var i = 0 ; i < RequestData.Digitalcontents.length; i++) {
         DigitalContents.push(RequestData.Digitalcontents[i]);
    };

    var GeoFencingData = {
                            "Loc" : { type : {type : String} , coordinates : []  },
                            "Digitalcontents" : [],
                            "LocationName" : String
                        };
        GeoFencingData.Digitalcontents = DigitalContents;
        GeoFencingData.LocationName = RequestData.LocationName;
        GeoFencingData.Loc.type = "Polygon";
        GeoFencingData.Loc.coordinates = [];
        GeoFencingData.Loc.coordinates.push(RequestData.Coordinates);


    //200 : OK
    //201 : Channel already exists for the user.
    //404 : Data is not valid.
    //500 : Internal server error.

    async.series([
        
        function(callback) {

            adminUsersSchema.findOne({ _id: RequestData._userid, "Channel.ChannelName": RequestData.ChannelName }, function(err,obj) 
            {
                //console.log(JSON.stringify(obj));
                if(err)
                {
                    console.log(err);
                    StatusCode = 500;
                    Message = "Internal server error";
                }
                else
                {
                    if(obj != null )
                    {
                        
                        for(var i=0;i<obj.Channel.length;i++)
                        {
                            if (obj.Channel[i].ChannelName === RequestData.ChannelName)
                            {
                                if(obj.Channel[i].GeoFencingData.length == 0 ) 
                                    {
                                        obj.Channel[i].GeoFencingData = [];
                                    }
                                obj.Channel[i].GeoFencingData.push(GeoFencingData);
                            }
                        }
                        
                        //assign the retrieved object to the variable AdminUserDbObject used to save the channel
                        AdminUserDbObject = obj;
                    }
                    else
                    {
                        StatusCode = 404;
                        Message = "Data is not valid";
                    }
                }
                callback();
            })
            
        }, //1st function end

        ], //end of function serize
            function(err) { //This function gets called after the two tasks have called their "task callbacks"
            
            if(StatusCode == 500)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
            }
            else if(StatusCode == 404)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
            }
            else
            {
                
                AdminUserDbObject.save(function(err,finalobj){
                    if(err)
                    {
                        StatusCode = 500;
                        Message = "Internal server error";
                        res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
                    }
                    else
                    {
                        var channelcount = finalobj.Channel.length;
                        var channelid = finalobj.Channel[channelcount - 1]._id;
                        StatusCode = 200;
                        Message = "OK";
                        
                        res.send({"_id" : channelid, "StatusCode" : StatusCode ,"Message" : Message});
                        //res.send(AdminUserDbObject);
                    }
                });
            }
        })
}