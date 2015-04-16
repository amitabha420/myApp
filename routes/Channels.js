var adminUsersSchema = require('./DbCollections.js').AdminUsersSchema;
var defaultConfig = require('../defaultConfig.json');
var async = require('async');




exports.GetChannels = function(req,res)
{
    var input = req.body;
    
    var ObjectId = require('mongoose').Types.ObjectId;
    adminUsersSchema.findOne(
        { _id : ObjectId(input._userid)}, 
        {
            "AppName" : 0,
            "IsApp" : 0,
            "IsSuperAdmin" : 0,
            "password" : 0,
            "User" : 0,
            "Channel.GeoFencingData" : 0,
            "Channel.SubscribedUsers" : 0
        },function(err,result)
        {
            if(err)
            {
                res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
            }
            else
            {
                res.send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});             
            }
        });
    
}


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
            AdminUser.BannerImageUrl = defaultConfig.channeldefaultbanner;
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
                var newchannel = {
                    "ChannelName" : AdminUser.ChannelName,
                                    "ChannelDescription" : AdminUser.ChannelDescription,
                                    "BannerImageUrl" : AdminUser.BannerImageUrl,
                };
                AdminUserDbObject.Channel.push(newchannel);
                       // res.send(AdminUserDbObject.Channel[2]);
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
                                                "Channel.$.BannerImageUrl" : AdminUser.BannerImageUrl,
                                                "Channel.$.ModifiedDate" : new Date(),
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

    adminUsersSchema.findOne({ _id: AdminUser._userid, "Channel.ChannelName": AdminUser.ChannelName }, function(err,obj) 
    {
        var channelindex = -1;
        for (var i = 0; i < obj.Channel.length ; i++) 
        {
            var channel = obj.Channel[i];
            if(channel.ChannelName == AdminUser.ChannelName)    
            {
                channelindex = i;
                break;
            }
        }
        if(channelindex != -1)
        {
            obj.Channel.splice(channelindex,1);    

            obj.save(function(error,result)
            {
                if(error)
                {
                    res.send({"StatusCode" : StatusCode ,"500" : "Internal server error"});
                }
                else
                {
                    res.send({"StatusCode" : "200" ,"Message" : "OK"});
                }
            });
        }
        else
        {
            res.send({"StatusCode" : "422" ,"Message" : "Unprocessable entity"});                            
        }
        
    });
}
    /*
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
    */





/* Input Data
{
   "_userid": "552294dea496af1c215a7235",
   "ChannelName" : "channel2",     
   "Coordinates" :[[28.52542,79.87061],[27.84059,78.78845],[27.19052,77.53052],[29.01381,77.67334 ],[28.52542,79.87061]],
  "Digitalcontents" : [ {
                            "Url" : "http://storage.googleapis.com/0syncspotteam-bucket01/Kalimba.mp3",
                            "Name" : "Example mp4",
                            "Type" : "video"
                        },
                          {
                            "Url" : "http://storage.googleapis.com/0syncspotteam-bucket01/Kalimba.mp3",
                            "Name" : "Example mp4",
                            "Type" : "image"
                        },
                                                 
                           {
                            "Url" : "http://storage.googleapis.com/0syncspotteam-bucket01/Kalimba.mp3",
                            "Name" : "Example mp4",
                            "Type" : "audio"
                        }      
                      ],
   "LocationName" : "India"
}
*/

//same location name validation is done for a channel
//This function will create a GeoLocation of a channel and also Insert Digital Content to it.
exports.UploadDigitalContent = function(req,res)
{
    var RequestData = req.body;
    var AdminUserDbObject;
    var DigitalContents= [];
    var StatusCode = 200;
    var Message = "";
    //console.log('hi');

    var GeoFencingData = {
                            "Loc" : { type : {type : String} , coordinates : []  },
                            "Digitalcontents" : [],
                            "LocationName" : String,
                            "Notification" : String,
                        };
        //GeoFencingData.Digitalcontents = DigitalContents;
        for (var i = 0 ; i < RequestData.Digitalcontents.length; i++) 
        {
            var imageurl = defaultConfig.contentdefaultbanner ;
            var startTime = parseFloat(RequestData.Digitalcontents[i].StartingTime).toFixed(2);
            var endTime = parseFloat(RequestData.Digitalcontents[i].EndingTime).toFixed(2);
            if(RequestData.Digitalcontents[i].ImageUrl)
            {
                imageurl = RequestData.Digitalcontents[i].ImageUrl;
            }
            var content = 
            {
                Url : RequestData.Digitalcontents[i].Url,
                Name : RequestData.Digitalcontents[i].Name,
                Type : RequestData.Digitalcontents[i].Type,
                ImageUrl : imageurl,
                StartingTime : startTime,
                EndingTime : endTime,
            };
             GeoFencingData.Digitalcontents.push(content);
        };
        GeoFencingData.LocationName = RequestData.LocationName;
        GeoFencingData.CentralCoordinate = [];
        GeoFencingData.CentralCoordinate.push(RequestData.CentralCoordinate);
        GeoFencingData.Notification = RequestData.Notification;
        GeoFencingData.Loc.type = "Polygon";
        GeoFencingData.Loc.coordinates = [];
        GeoFencingData.Loc.coordinates.push(RequestData.Coordinates);
        //res.send(GeoFencingData);

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
                                //Location name duplication checking
                                //var locationexists = false;
                                var dbfencingdata = obj.Channel[i].GeoFencingData;
                                for(var j=0; j<dbfencingdata.length; j++)
                                {
                                    if(dbfencingdata[j].LocationName == GeoFencingData.LocationName)
                                    {
                                        //locationexists = true ;
                                        StatusCode = 405;
                                        Message = "Location already exists.";
                                    }
                                }

                                if(obj.Channel[i].GeoFencingData.length == 0 ) 
                                    {
                                        obj.Channel[i].GeoFencingData = [];
                                    }
                                obj.Channel[i].GeoFencingData.push(GeoFencingData);
                                //console.log(JSON.stringify(obj));
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
            //res.send(AdminUserDbObject);
            
            if(StatusCode == 500)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
            }
            else if(StatusCode == 404)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
            }
            else if(StatusCode == 405)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : Message});
            }
            else
            {
                //res.send(AdminUserDbObject);
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


//Edit only a existing digital content of a geolocation of a channel
exports.EditDigitalContents = function(req,res)
{
    var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;
    var channelid = new ObjectId(input.channelid);
    var locationid = new ObjectId(input.locationid);
    //var AdminUserDbObject;
    var channelindex,fencingIndex ;
    var fencingObj;
    var flag = false;

    //retrieve the channel user and update it.
    //In our version I get Too many positional (i.e. '$') elements found in path  for update query which is get fixed in 3.1


    adminUsersSchema.findOne({
                    "Channel._id" : channelid
                    ,"Channel.GeoFencingData._id" : locationid
                    ,"Channel.GeoFencingData.Digitalcontents.Name" : input.Old.Name
                    ,"Channel.GeoFencingData.Digitalcontents.Type" : input.Old.Type
                    },function(err,result)
                    {
                        
                        for (var i = 0; i < result.Channel.length ; i++) 
                        {
                            //console.log(JSON.stringify(result.Channel[i]));
                            var channel = result.Channel[i];
                            
                            if(channel._id == input.channelid )    
                            {
                                
                                for (var j = 0; j < channel.GeoFencingData.length; j++) 
                                {

                                    var fencing = channel.GeoFencingData[j];
                                    if(fencing._id == input.locationid)
                                    {
                                        //console.log('geoin');
                                        for (var k = 0; k < fencing.Digitalcontents.length; k++) 
                                        {
                                            var digitalcontent = fencing.Digitalcontents[k];
                                            //console.log(input.Old.Type + "," + input.Old.Name + "," + input.Old.Url);
                                            //console.log(digitalcontent.Type + "," + digitalcontent.Name + "," + digitalcontent.Url);
                                            if(digitalcontent.Type.toLowerCase() == input.Old.Type.toLowerCase() && 
                                                digitalcontent.Name.toLowerCase() == input.Old.Name.toLowerCase() &&
                                                digitalcontent.Url.toLowerCase() == input.Old.Url.toLowerCase())
                                            {

                                                result.Channel[i].GeoFencingData[j].Digitalcontents[k].Type = input.New.Type;
                                                result.Channel[i].GeoFencingData[j].Digitalcontents[k].Name = input.New.Name;
                                                result.Channel[i].GeoFencingData[j].Digitalcontents[k].Url = input.New.Url;
                                                result.Channel[i].GeoFencingData[j].Digitalcontents[k].ImageUrl = input.New.Imageurl;
                                                result.Channel[i].GeoFencingData[j].Digitalcontents[k].StartingTime = input.New.StartingTime,
                                                result.Channel[i].GeoFencingData[j].Digitalcontents[k].EndingTime = input.New.EndingTime,
                                                channelindex = i;
                                                fencingIndex = j;
                                                fencingObj = result.Channel[i].GeoFencingData[j];
                                                flag = true;

                                            }
                                        }
                                    }
                                }
                            }
                        }
                        //console.log(flag);
                        if(flag)
                        {
                            result.Channel[channelindex].GeoFencingData.splice(fencingIndex,1);
                            result.Channel[channelindex].GeoFencingData.push(fencingObj);    
                            result.save(function(err,obj)
                            {
                                //console.log(err);
                                //console.log(JSON.stringify(obj));
                                if(err)
                                {
                                    res.send({"result" : "", "StatusCode" : StatusCode ,"500" : "Internal server error"});
                                }
                                else
                                {
                                    
                                    res.send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});
                                    //res.send(AdminUserDbObject);
                                }
                            });
                        }
                        else
                        {
                            res.send({"result" : "", "StatusCode" : "422" ,"Message" : "Unprocessable entity"});
                        }

                        
                        //res.send(result);
                    });
    
}