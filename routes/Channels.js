var adminUsersSchema = require('./DbCollections.js').AdminUsersSchema;
var GeoLocationSchema = require('./DbCollections.js').GeoLocationSchema;
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
            "User" : 0
            
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Create channel
This API will create a channel for a channel admin user. But only a channel will be created by user, no syncspot is created 
for the user by this API.
Input data
{
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
    var ObjectId = require('mongoose').Types.ObjectId;
    var _userid = new ObjectId(AdminUser._userid);

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

            adminUsersSchema.findOne({ _id: _userid }, function(err,obj) 
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
        						if (obj.Channel[i].ChannelName.toLowerCase() === AdminUser.ChannelName.toLowerCase())
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
                            }
                        });
            }
        })
}



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Edit channel
channel admin user can edit only channel details by this API
Input data
 
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
    var ObjectId = require('mongoose').Types.ObjectId;
    var _userid = new ObjectId(AdminUser._userid);


    var serchtext = new RegExp(AdminUser.ChannelName, "i");
    adminUsersSchema.update(
                                { _id: _userid, "Channel.ChannelName": serchtext },
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



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*Delete a particular channel for a channel admin user
Input data
    {
        "_userid": "551d0aa75e297dec2204bd58",  // channel admin user id
        "ChannelName" : "channel1"
    }
*/
exports.Delete = function(req,res)
{
    //200 : OK
    //404 : Data is not valid.
    //500 : Internal server error.

    var AdminUser = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;
    var _userid = new ObjectId(AdminUser._userid);

    var serchtext = new RegExp(AdminUser.ChannelName, "i");

    adminUsersSchema.findOne({ _id: _userid, "Channel.ChannelName": serchtext }, function(err,obj) 
    {
        if(obj!=null)
        {
            var channelindex = -1;
                    for (var i = 0; i < obj.Channel.length ; i++) 
                    {
                        var channel = obj.Channel[i];
                        if(channel.ChannelName.toLowerCase() == AdminUser.ChannelName.toLowerCase())    
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
                                //also dele the geo locations of that channel if exists
                                GeoLocationSchema.remove({UserId : AdminUser._userid,ChannelName : AdminUser.ChannelName},
                                    function(e,r)
                                    {
                                        console.log(r);
                                    });
                                res.send({"StatusCode" : "200" ,"Message" : "OK"});
                            }
                        });
                    }
                    else
                    {
                        res.send({"StatusCode" : "422" ,"Message" : "Invalid entity"});                            
                    }
        }
        else
        {
            res.send({"StatusCode" : "422" ,"Message" : "Invalid entity"});                            
        }
        
        
    });
}





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* This API is not enlisted in Backend excel for use if user. It will delete all geofencing data of a channel.
{
        "_userid": "553de5d4b899e2601758c0a3",
        "ChannelName" : "ChannelDemo1"
}
*/
exports.DeleteGeoFenceDataForChannel = function(req,res)
{
    //200 : OK
    //404 : Data is not valid.
    //500 : Internal server error.

    var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;
    //var _userid = new ObjectId(AdminUser._userid);

    GeoLocationSchema.remove({UserId : input._userid,ChannelName : input.ChannelName},
        function(error,result)
        {
             if(error)
                {
                    res.send({"result" : err,"StatusCode" : StatusCode ,"500" : "Internal server error"});
                }
                else
                {

                    res.send({"result" : result," StatusCode" : "200" ,"Message" : "OK"});
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






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
This function will create a GeoLocation of a channel .
-> same Geolocation name validation is done for a channel
Input Data

{
    "_userid": "553de5d4b899e2601758c0a3",
    "ChannelName": "ChannelDemo1",
    "CentralCoordinate" : [88.42984020709991,22.568980095843376],
    "Coordinates": [
            [
              88.42984020709991,
              22.568980095843376
            ],
            [
              88.43088090419769,
              22.569217868482212
            ],
            [
              88.43097746372223,
              22.568890930998084
            ],
            [
              88.43067705631256,
              22.568563992738593
            ],
            [
              88.43004941940308,
              22.568593714430587
            ],
            [
              88.42975437641144,
              22.568796812487697
            ],
            [
              88.42984020709991,
              22.568980095843376
            ]
          ],
    
    "LocationName": "Sector-V",
    "Notification": "you are in Sector V"
}
*/
exports.CreateGeoLocation = function(req,res)
{
    var RequestData = req.body;
    var AdminUserDbObject;
    var DigitalContents= [];
    var StatusCode = 200;
    var Message = "";


    var ObjectId = require('mongoose').Types.ObjectId;
    var _userid = new ObjectId(RequestData._userid);

    var LocationObject = new GeoLocationSchema();
    LocationObject.UserId = RequestData._userid;
    LocationObject.ChannelName = RequestData.ChannelName;
    LocationObject.loc.type = "Polygon";
    LocationObject.loc.coordinates = [];
    LocationObject.loc.coordinates.push(RequestData.Coordinates);
    LocationObject.Matchpoint.type = "Point";
    LocationObject.Matchpoint.coordinates = RequestData.CentralCoordinate;
    LocationObject.LocationName = RequestData.LocationName;
    LocationObject.Notification = RequestData.Notification;

    /*
    var GeoFencingData = {
                            "Loc" : { type : {type : String} , coordinates : []  },
                            "Digitalcontents" : [],
                            "Matchpoint" : { type : {type : String} , coordinates : []  },
                            "LocationName" : String,
                            "Notification" : String,
                        };
        //GeoFencingData.Digitalcontents = DigitalContents;
        for (var i = 0 ; i < RequestData.Digitalcontents.length; i++) 
        {
            var imageurl = defaultConfig.contentdefaultbanner ;
            var startTime = parseFloat(RequestData.Digitalcontents[i].StartingTime).toFixed(2);
            var endTime = parseFloat(RequestData.Digitalcontents[i].EndingTime).toFixed(2);
            var MaxAccessValue = RequestData.Digitalcontents[i].MaxAccessValue;
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
                MaxAccessValue : MaxAccessValue
            };
             GeoFencingData.Digitalcontents.push(content);
        };
        GeoFencingData.LocationName = RequestData.LocationName;
        //GeoFencingData.CentralCoordinate = RequestData.CentralCoordinate;//[];
        GeoFencingData.CentralCoordinate = [];
        GeoFencingData.CentralCoordinate.push(RequestData.CentralCoordinate);
        GeoFencingData.Notification = RequestData.Notification;
        GeoFencingData.Loc.type = "Polygon";
        GeoFencingData.Loc.coordinates = [];
        GeoFencingData.Loc.coordinates.push(RequestData.Coordinates);

        GeoFencingData.Matchpoint.type = "Point";
        GeoFencingData.Matchpoint.coordinates = RequestData.CentralCoordinate;
        //res.send(GeoFencingData);
        */

    //200 : OK
    //201 : Channel already exists for the user.
    //404 : Data is not valid.
    //500 : Internal server error.
    
    
    async.series([
        function(callback){
            //Location name duplication checking
            GeoLocationSchema.findOne({UserId : RequestData._userid, ChannelName : RequestData.ChannelName, LocationName : RequestData.LocationName},
                function(err,res)
                {
                    if(err)
                    {
                        StatusCode = 500;
                        Message = "Internal server error.";
                    }
                    else
                    {
                        if(res!=null)
                        {
                            StatusCode = 405;
                            Message = "Location already exists.";
                        }
                    }
                    callback();
                });
        },
        
        function(callback) {

            adminUsersSchema.findOne({ _id: _userid, "Channel.ChannelName": RequestData.ChannelName }, function(err,obj) 
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
                                LocationObject.ChannelId = obj.Channel[i]._id;
                                LocationObject.BannerImageUrl = obj.Channel[i].BannerImageUrl;
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
                //res.send(LocationObject);
                //console.log(LocationObject);
                
                LocationObject.save(function(err,obj)
                    {
                        if(err)
                        {
                            console.log(err);
                            StatusCode = 500;
                            Message = "Internal server error";
                            res.send({"_locationid" : err, "StatusCode" : StatusCode ,"Message" : Message});
                        }
                        else
                        {
                            adminUsersSchema.update(
                                { _id: _userid, "Channel.ChannelName": RequestData.ChannelName },
                                { $currentDate: { "Channel.$.ModifiedDate" : true } },
                                { multi: false },
                                function(error,result)
                                {
                                    if(!error)
                                    {
                                        console.log('time updated');     
                                    }
                                }
                            );

                            StatusCode = 200;
                            Message = "OK";
                            
                            res.send({"_locationid" : obj._id, "StatusCode" : StatusCode ,"Message" : Message});
                            //res.send(AdminUserDbObject);
                        }
                    });
            }
        })
}

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
Edit only a existing digital content of a geolocation of a channel
{
    "locationid" : "553f2da982d5f2ac1618ad78",
    "contentid" : "553f2dd182d5f2ac1618ad7a",
    "Url" : "abcd",
    "Name" : "Name",
    "Type" : "audio",
    "ImageUrl" : "ImageUrl",
    "StartingTime" : "StartingTime",
    "EndingTime" : "EndingTime",
    "MaxAccessValue" : "MaxAccessValue"
}
*/
exports.EditDigitalContents = function(req,res)
{
    var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;
    var contentid = new ObjectId(input.contentid);
    var locationid = new ObjectId(input.locationid);
    

    GeoLocationSchema.update({_id : locationid,'Digitalcontents._id' : contentid}
                        ,
                        { 
                            $set: 
                            { 
                                'Digitalcontents.$.Url': input.Url,
                                'Digitalcontents.$.Name': input.Name,
                                'Digitalcontents.$.Type' : input.Type,
                                'Digitalcontents.$.ImageUrl' : input.ImageUrl,
                                'Digitalcontents.$.StartingTime' : input.StartingTime,
                                'Digitalcontents.$.EndingTime' : input.EndingTime,
                                'Digitalcontents.$.MaxAccessValue' : input.MaxAccessValue
                            } 
                        },
                        { multi: false },
                        function(err,result)
                        {
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
This API will add a single new content to an existing geolocation in a channel
-> No validation is done on same content addition in digital content addition
INPUT
{
        "Url": "http://storage.googleapis.com/0syncspotteam-bucket01/Vdieo_635605735016179351.mp4",
        "Name": "video mp4",
        "Type": "video",
        "ImageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIdFCvbFc2epyT-svp1Dts4gtchWOjvgy2i-8bQwK8-aQzbz4rA",
        "StartingTime": "9:00",
        "EndingTime": "10:00",
        "MaxAccessValue" : "5",
        "locationid" : "5538a08b955b7f901ba26b52"
}

*/
exports.addContentToChannel = function(req,res)
{

    var input = req.body;
    
    var ObjectId = require('mongoose').Types.ObjectId;
    var locationid = new ObjectId(input.locationid);
    
    var flag = false;
    

    //retrieve the channel user and update it.
    //In our version I get Too many positional (i.e. '$') elements found in path  for update query which is get fixed in 3.1

    var imageurl = defaultConfig.contentdefaultbanner ;
    var startTime = parseFloat(input.StartingTime).toFixed(2);
    var endTime = parseFloat(input.EndingTime).toFixed(2);
    var MaxAccessValue = input.MaxAccessValue;

    if(input.ImageUrl)
    {
        imageurl = input.ImageUrl;
    }
    
    GeoLocationSchema.findOne({"_id" : locationid}
                    ,function(err,result)
                    {
                        if(result != null)
                        {
                            var content = 
                                {
                                    Url : input.Url,
                                    Name : input.Name,
                                    Type : input.Type,
                                    ImageUrl : imageurl,
                                    StartingTime : startTime,
                                    EndingTime : endTime,
                                    MaxAccessValue : MaxAccessValue
                                };
                            //res.send(result);
                            
                            if(result.Digitalcontents.length == 0)
                            {
                                result.Digitalcontents = [];
                            }
                            result.Digitalcontents.push(content); 

                            //save to database
                            result.save(function(error,obj)
                            {
                                if(err)
                                {
                                    res.send({"result" : err, "StatusCode" : StatusCode ,"500" : "Internal server error"});
                                }
                                else
                                {
                                    res.send({"result" : obj, "StatusCode" : "200" ,"Message" : "OK"});
                                }
                            });
                        }
                        else
                            {
                                res.send({"result" : "" , "StatusCode" : "422" ,"Message" : "Invalid location"});
                            }   
                        
                    });
}