
var UsersCollection = require('./DbCollections.js').UsersCollection;
var AdminUsersSchema = require('./DbCollections.js').AdminUsersSchema;
var GeoLocationCollection = require('./DbCollections.js').GeoLocationSchema;
var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;
var ValidateUserCollection = require('./DbCollections.js').ValidateUserCollection;
var async = require('async');

var defaultConfig = require('../defaultConfig.json');


/*Create Admin Users*/
/*
    {
      "User" : "syncspot2",
      "password" : "syncspot1"
    }
*/

exports.CreateAdminUsres = function(req,res)
{
    var obj = req.body;

    //console.log(obj.User + ',' + obj.password);
    var adminuser = new AdminUsersSchema();
    adminuser.User = obj.User;
    adminuser.password = obj.password;
    adminuser.IsSuperAdmin = false;
    adminuser.IsApp = false ;
    adminuser.AppName = '';

    console.log(JSON.stringify(adminuser));
    AdminUsersSchema.findOne({User : obj.User},
        function(err,result)
        {
            if(err)
            {
                res.send({"_id" : "" , "StatusCode" : "500","Message" : "Internal server error"});    
            }
            else
            {
                if(result == null)
                {
                    adminuser.save(function (err, obj) 
                    {
                        if (err) 
                        {
                            console.log(err);// ...
                            res.send({"_id" : "" , "StatusCode" : "500","Message" : "Internal server error"});
                        }

                        var responseObj = {"_id" : obj._id , "StatusCode" : "200", "Message" : "OK"};
                        res.send(responseObj);
                    });
                }
                else
                {
                    res.send({"_id" : "" , "StatusCode" : "203","Message" : "UserName is not available"});           
                }
            }
        });
}


/*
{
  "user" : "syncspot",
  "password" : "syncspot"
}
*/

exports.adminLoggin = function(req,res)
{

    var obj = req.body;

    AdminUsersSchema.findOne({User : obj.user,password : obj.password, IsSuperAdmin : false, IsApp : false},
        {
            _id : 1
        },
        function(err,result)
        {
            if(err)
            {
                res.send({"result" : "" , "StatusCode" : "500","Message" : "Internal server error"});    
            }
            else
            {
                if(result == null)
                {
                    res.send({"result" : "", "StatusCode" : "202" ,"Message" : "Invalid UserName and Password"});             
                }
                else    
                {
                    var ValidateUser = new ValidateUserCollection();
                    ValidateUser.UserId = result._id;
                    ValidateUser.save(function(err1,result1)
                        {
                            if(err1)
                            {
                                res.send({"result" : "" , "StatusCode" : "500","Message" : "Internal server error"});    
                            }
                            else
                            {
                                res.send({"result" : result,"token": result1._id, "StatusCode" : "200" ,"Message" : "OK"});                 
                            }
                        });
                    //res.send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});                 
                }
                
            }
        });
}

exports.SuperAdminLoggin = function(req,res)
{
    var obj = req.body;

    AdminUsersSchema.findOne({User : obj.user,password : obj.password, IsSuperAdmin : true, IsApp : false},
        {
            _id : 1
        },
        function(err,result)
        {
            if(err)
            {
                res.send({"_id" : "" , "StatusCode" : "500","Message" : "Internal server error"});    
            }
            else
            {
                if(result == null)
                {
                    res.send({"result" : "", "StatusCode" : "202" ,"Message" : "Invalid UserName and Password"});             
                }
                else    
                {
                    res.send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});                 
                }
                
            }
        });   
}

/*No Imput needed*/
exports.getAdminsData = function(req,res)
{
	
	var ObjectId = require('mongoose').Types.ObjectId;
	
    AdminUsersSchema.find({"IsApp" : false,"IsSuperAdmin" : false},
    	function(err,result)
    	{
    		res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});		
    	});
}


/*
    {"_userid" : "kjfoidsnfno9444"}
*/
exports.getChannels4Admin = function(req,res)
{
	var input = req.body;
    //console.log('hi');
    var ObjectId = require('mongoose').Types.ObjectId;
    AdminUsersSchema.find(
        { _id : ObjectId(input._userid)}, 
        {
            "AppName" : 0,
            "IsApp" : 0,
            "IsSuperAdmin" : 0,
            "password" : 0,
            "User" : 0,
            
        },function(err,result)
        {
            if(err)
            {
                res.status(200).send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
            }
            else
            {
                res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});             
            }
        });
}


/*
    {
      "ChannelId" : "55548fefafa9b5541accf789"
    }
*/
/*
    OUTPUT


    {
    "result": [
            {
                "_id": "553f2da982d5f2ac1618ad78",
                "BannerImageUrl": "http://syncspot.net/wp-content/uploads/2014/12/SyncSpot-Logo-V2.png",
                "Notification": "you are in Sector V",
                "LocationName": "Sector-V",
                "__v": 1
            },
            {
                "_id": "553f2df282d5f2ac1618ad7b",
                "BannerImageUrl": "http://syncspot.net/wp-content/uploads/2014/12/SyncSpot-Logo-V2.png",
                "Notification": "you are in Nico Park",
                "LocationName": "Nico Park",
                "__v": 0
            }
        ],
        "StatusCode": "200",
        "Message": "OK"
    }
*/
exports.GetLocationsOfChannel_v1 = function(req,res)
{
    var input = req.body;
    console.log('getLocations_type1');
    var ObjectId = require('mongoose').Types.ObjectId;
    GeoLocationCollection.find({"ChannelId" : input.ChannelId},
    {
        "ChannelId" : 0,
        "ChannelName" : 0,
        "UserId" : 0,
        "SubscribedUsers" : 0,
        "Digitalcontents" : 0,
        "Matchpoint" : 0,
        "loc" : 0,
        
    }
    ,function(err,result)
        {
            if(err)
            {
                res.status(200).send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
            }
            else
            {
                res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});             
            }
        }
    );
}


/*
    {
      "ChannelId" : "55548fefafa9b5541accf789"
    }
*/
exports.GetLocationsOfChannel_v2 = function(req,res)
{
    var input = req.body;
    console.log('getLocations_type2');
    var ObjectId = require('mongoose').Types.ObjectId;
    GeoLocationCollection.find({"ChannelId" : input.ChannelId},
    {
        "ChannelId" : 0,
        "ChannelName" : 0,
        "UserId" : 0,
        "SubscribedUsers" : 0
        //"Digitalcontents" : 0,
        //"Matchpoint" : 0,
        //"loc" : 0,
        
    }
    ,function(err,result)
        {
            if(err)
            {
                res.status(200).send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
            }
            else
            {
                res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});             
            }
        }
    );
}