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

    adminUsersSchema.update(
                                { _id: _userid, "Channel.ChannelName": AdminUser.ChannelName },
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

    adminUsersSchema.findOne({ _id: _userid, "Channel.ChannelName": AdminUser.ChannelName }, function(err,obj) 
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





/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* This API is not enlisted in Backend excel for use if user. It will delete all geofencing data of a channel.
{
        "_userid": "551d0aa75e297dec2204bd58",
        "ChannelName" : "channel1"
}
*/
exports.DeleteGeoFenceDataForChannel = function(req,res)
{
    //200 : OK
    //404 : Data is not valid.
    //500 : Internal server error.

    var AdminUser = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;
    var _userid = new ObjectId(AdminUser._userid);

    adminUsersSchema.findOne({ _id: _userid, "Channel.ChannelName": AdminUser.ChannelName }, function(err,obj) 
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
            obj.Channel[channelindex].GeoFencingData = [];

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






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* 
This function will create a GeoLocation of a channel and also Insert Digital Content to it.
-> same Geolocation name validation is done for a channel
-> In content either StartingTime,EndingTime will be provided or MaxAccessValue will be provided. It could also be possible 
that none of these 3 fileds will be provided for content. MaxAccessValue will not be set 0.
Input Data
{
    "_userid": "5534fea77dedf89f0a2a5017",
    "ChannelName": "HBO",
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
    "Digitalcontents": [
        {
            "Url": "http://storage.googleapis.com/0syncspotteam-bucket01/Vdieo_635605735016179351.mp4",
            "Name": "video mp4",
            "Type": "video",
            "ImageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIdFCvbFc2epyT-svp1Dts4gtchWOjvgy2i-8bQwK8-aQzbz4rA",
            "StartingTime": "9:00",
            "EndingTime": "10:00",
            "MaxAccessValue" : "5"

        },
        {
            "Url": "http://storage.googleapis.com/0syncspotteam-bucket01/Vdieo_635605735016179351.mp4",
            "Name": "video mp4",
            "Type": "video",
            "ImageUrl": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSRIdFCvbFc2epyT-svp1Dts4gtchWOjvgy2i-8bQwK8-aQzbz4rA",
            "StartingTime": "9:00",
            "EndingTime": "10:00",
            "MaxAccessValue":""
        }
    ],
    "LocationName": "Sector-V",
    "Notification": "you are in Sector V"
}
*/
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
        GeoFencingData.CentralCoordinate = RequestData.CentralCoordinate;//[];
        //GeoFencingData.CentralCoordinate.push(RequestData.CentralCoordinate);
        GeoFencingData.Notification = RequestData.Notification;
        GeoFencingData.Loc.type = "Polygon";
        GeoFencingData.Loc.coordinates = [];
        GeoFencingData.Loc.coordinates.push(RequestData.Coordinates);

        GeoFencingData.Matchpoint.type = "Point";
        GeoFencingData.Matchpoint.coordinates = RequestData.CentralCoordinate;
        //res.send(GeoFencingData);

    //200 : OK
    //201 : Channel already exists for the user.
    //404 : Data is not valid.
    //500 : Internal server error.
    
    var ObjectId = require('mongoose').Types.ObjectId;
    var _userid = new ObjectId(RequestData._userid);
    
    async.series([
        
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
                        res.send({"_id" : err, "StatusCode" : StatusCode ,"Message" : Message});
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

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
Edit only a existing digital content of a geolocation of a channel
*/
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
                                                result.Channel[i].GeoFencingData[j].Digitalcontents[k].MaxAccessValue = input.New.MaxAccessValue,
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
        "_userid": "5535dd934ff5a9c0179147ee",
        "ChannelName": "HBO",
        "locationid" : "5538a08b955b7f901ba26b52"
}

*/
exports.addContentToChannel = function(req,res)
{

    var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;
    var _userid = new ObjectId(input._userid);
    var locationid = new ObjectId(input.locationid);
    var channelindex,fencingIndex;
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

    adminUsersSchema.findOne({
                    "_id" : _userid
                    ,"Channel.ChannelName" : input.ChannelName
                    ,"Channel.GeoFencingData._id" : locationid
                    
                    },function(err,result)
                    {
                        
                        for (var i = 0; i < result.Channel.length ; i++) 
                        {
                            //console.log(JSON.stringify(result.Channel[i]));
                            var channel = result.Channel[i];
                            
                            if(channel.ChannelName == input.ChannelName )    
                            {
                                for (var j = 0; j < channel.GeoFencingData.length; j++) 
                                {
                                    var fencing = channel.GeoFencingData[j];
                                    if(fencing._id == input.locationid)
                                    {
                                        channelindex = i;
                                        fencingIndex = j;
                                        flag =true;
                                        break;
                                    }
                                }
                                if(flag)
                                    break;
                            }
                        }
                        console.log("channelindex : " + channelindex + "flag : " + flag);
                        if(flag)
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
                            console.log(result.Channel[channelindex].GeoFencingData[fencingIndex].Digitalcontents.length);
                            if(result.Channel[channelindex].GeoFencingData[fencingIndex].Digitalcontents.length == 0)
                            {
                                result.Channel[channelindex].GeoFencingData[fencingIndex].Digitalcontents = [];
                            }
                            result.Channel[channelindex].GeoFencingData[fencingIndex].Digitalcontents.push(content); 

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
                            res.send({"result" : "", "StatusCode" : "422" ,"Message" : "Unprocessable entity"});
                        }
                    });
}