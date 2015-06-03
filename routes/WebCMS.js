
var UsersCollection = require('./DbCollections.js').UsersCollection;
var AdminUsersSchema = require('./DbCollections.js').AdminUsersSchema;
var GeoLocationCollection = require('./DbCollections.js').GeoLocationSchema;
var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;
var ValidateUserCollection = require('./DbCollections.js').ValidateUserCollection;
var UserSavedContentsSchema = require('./DbCollections.js').UserSavedContentsSchema;
var async = require('async');
var jwt = require('jwt-simple'); //--
var moment = require('moment');  //--

var defaultConfig = require('../defaultConfig.json');


/*Create Admin Users*/
/*
    {
      "user" : "syncspot2",
      "password" : "syncspot1",
      "firstName" : "",
      "lastName" : "",
      "address" : ""
    }
*/

exports.CreateAdminUsres = function(req,res)
{
    var obj = req.body;

    //console.log(obj.User + ',' + obj.password);
    var adminuser = new AdminUsersSchema();
    adminuser.User = obj.user;
    adminuser.password = obj.password;
    adminuser.IsSuperAdmin = false;
    adminuser.IsApp = false ;
    adminuser.AppName = '';
    adminuser.firstName = obj.firstName;
    adminuser.lastName = obj.lastName;
    adminuser.address = obj.address;

    
    var serchtext = new RegExp(adminuser.User, "i");
    
    AdminUsersSchema.findOne({User : serchtext},
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
                    //console.log(JSON.stringify(result));
                    adminuser.save(function (err, obj) 
                    {
                        if (err) 
                        {
                            //console.log(err);// ...
                            res.send({"_id" : err , "StatusCode" : "500","Message" : "Internal server error"});
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


/*Update Admin Users*/
/*
    {
      "_id" : "dsadadaassad",
      "firstName" : "",
      "lastName" : "",
      "address" : ""
    }
*/
exports.UpdateAdminUsres = function(req,res)
{
    var obj = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;

    AdminUsersSchema.update({_id : ObjectId(obj._id)},
                             {
                                $set : {
                                           //"password" :  obj.password,
                                           "firstName" : obj.firstName,
                                           "lastName" : obj.lastName,
                                           "address" : obj.address,
                                       }
                             }
                            ).exec(function(e,r)
                            {
                                if(e)
                                        {
                                            res.send({ "StatusCode" : 500 ,"Message" : "Internal server error"});
                                        }
                                        else
                                        {
                                            if(r == 1)
                                            {
                                                res.send({"StatusCode" : 200 ,"Message" : "OK"});
                                            }
                                            else
                                            {
                                                res.send({"StatusCode" : 404 ,"Message" : "Data is not valid"});
                                            }    
                                        }
                            });
}


exports.DeleteChannelAdminbyID = function(req,res)
{
    var obj = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;

    AdminUsersSchema.remove({_id : ObjectId(obj._id)},function(e,r)
    {
        if(e)
                {
                    res.send({"StatusCode" : "500","Message" : "Internal server error"});    
                }
                else
                {
                    GeoLocationCollection.remove({UserId : obj._id },
                        function(e1,r1)
                        {
                            if(e1)
                            {
                                res.send({"StatusCode" : "500","Message" : "Internal server error"});  
                            }
                            else
                            {
                                res.send({"StatusCode" : "200" ,"Message" : "OK"});  
                            }
                        });
                }
    })
}

/*
INPUT
{ 
  "_id" : "55656eeca8523ee413960f50"
}
*/
exports.GetChannelAdminByID = function(req,res)
{
    var obj = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;

    AdminUsersSchema.findOne({_id : ObjectId(obj._id)},
        function(e,r)
        {
            if(e)
                {
                    res.send({"result" : "" , "StatusCode" : "500","Message" : "Internal server error"});    
                }
                else
                {
                    res.send({"result" : r, "StatusCode" : "200" ,"Message" : "OK"});                 
                }
        });
}


/*
{
  "user" : "syncspot",
  "password" : "syncspot"
}
*/
//admin and superadmin login is integrated in same function
exports._Login = function(req,res)
{
    //res.send('ok');

    
    var obj = req.body;

    var _user = new RegExp(obj.user, "i");
    AdminUsersSchema.findOne({User : _user,password : obj.password, IsApp : false},
        {
            _id : 1,
            IsSuperAdmin : 1,
            Channel : 1,
            firstName : 1,
            lastName : 1,
            address : 1,

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
                    //res.send({"result" : result,"token": token, "StatusCode" : "200" ,"Message" : "OK"});
                    
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
                                console.log(result1._id);
                                var defaultConfig = require('../defaultConfig.json');
                                var expires = moment().add(8,'hours').valueOf();
                                var token = jwt.encode({
                                  iss: result1._id,
                                  exp: expires
                                }, defaultConfig.jwtTokenSecret);

                                res.send({"result" : result,"token": token, "StatusCode" : "200" ,"Message" : "OK"});                 
                            }
                        });
                    //res.send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});                 
                }               
            }
        });
}



/*No Imput needed*/
exports.getAdminsData = function(req,res)
{
	
	var ObjectId = require('mongoose').Types.ObjectId;
	
    AdminUsersSchema.find({"IsApp" : false,"IsSuperAdmin" : false},
        {
            "AppName" : 0,
            "IsApp" : 0,
            "IsSuperAdmin" : 0,
            "password" : 0,
            "__v" : 0
            
        },
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
            "__v" : 0
            
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
        "__v" : 0,
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
        "SubscribedUsers" : 0,
        "__v":0
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


/*
{
    "_id" : "553f2da982d5f2ac1618ad78"
}
*/
exports.getLocationDetailsByLocationId =function(req,res)
{
    var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;
    GeoLocationCollection.findOne({"_id" : input._id},
    {
        
        "ChannelId" : 0,
        "ChannelName" : 0,
        "UserId" : 0,
        "SubscribedUsers" : 0,
        "__v":0
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
  "fromDate" : ["2015","5","28"],
  "toDate" : ["2015","5","8"],
  "contentid" : "552fc6fb8a5ec0b0060bf3b1"
}
*/
//get a content stats between 2 date range
exports.GetContentWiseStats_v1 = function(req,res)
{

    var input = req.body;
    var _fromDate = input.fromDate;
    var _toDate = input.toDate;
    //console.log(input);

    var fromDate = new Date(parseInt(_fromDate[0]),parseInt(_fromDate[1]) - 1,parseInt(_fromDate[2]));
    var toDate = new Date(parseInt(_toDate[0]),parseInt(_toDate[1]) - 1,parseInt(_toDate[2]));
    //console.log(fromDate);
    //console.log(toDate);

    StatContentAccessSchema.aggregate(
        [{
                $match :{
                            contentid : input.contentid,
                            CreateDate : {$gte :toDate, $lte : fromDate }
                        }
               
       },
           {"$project" : {  
                "contentid" : "$contentid",
                   
               "date" : "$CreateDate",  
               "_id" : 0,  
               "h" : {  
                    "$hour" : "$CreateDate"  
               },  
               "m" : {  
                    "$minute" : "$CreateDate"  
               },  
               "s" : {  
                    "$second" : "$CreateDate"  
               },  
               "ml" : {  
                    "$millisecond" : "$CreateDate"  
               }  
          }
    },
    {"$project" : {     
                
                    "contentid" : "$contentid",
               "date" : {      
                    "$subtract" : [      
                         "$date",      
                         {      
                              "$add" : [      
                                   "$ml",      
                                   {      
                                        "$multiply" : [      
                                             "$s",      
                                             1000      
                                        ]      
                                   },      
                                   {      
                                        "$multiply" : [      
                                             "$m",      
                                             60,      
                                             1000      
                                        ]      
                                   },      
                                   {      
                                        "$multiply" : [      
                                             "$h",      
                                             60,      
                                             60,      
                                             1000      
                                        ]      
                                   }      
                              ]      
                         }      
                    ]      
               }      
          }      
     },   
           
           {
           $group:{ 
                       _id: 
                            {
                                contentid : "$contentid", date : "$date"  
                            },
                       count : {$sum : 1}
               }
           }
           ],
           function(error,result)
           {
                if(error)
                    res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
                else
                    res.send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});      
           });

}


exports.getContentByLocationId = function(req,res)
{
    var input = req.body;
    var LocationId=input._id;
    console.log(LocationId);
    var ObjectId = require('mongoose').Types.ObjectId;
    GeoLocationCollection.find({"_id":ObjectId(LocationId)},
        {
            Digitalcontents:1,
            _id:0
        },
     function(err,result)
     {
        if(err)
            res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});      
        else
            res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  
     });
}


exports.removeContentByContentId = function(req,res)
{
    var input = req.body;
    var LocationId=input._id;
    console.log(LocationId);
    var ObjectId = require('mongoose').Types.ObjectId;
    GeoLocationCollection.findOne({"Digitalcontents._id":ObjectId(LocationId)},
    function(err,result)
    {
     if(result!=null)
        {
            if(err)
            {
                res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});      
            }
            else
            {
                console.log(result.Digitalcontents.length);
                var contentIndex=-1;
                for (var i = 0; i < result.Digitalcontents.length; i++) 
                {
                    if(result.Digitalcontents[i]["_id"]==LocationId)
                    {
                        contentIndex=i;
                        console.log("true");
                        break;
                    }
                }
                if(contentIndex!=-1)
                {
                    result.Digitalcontents.splice(contentIndex,1);
                    result.save(function(error,obj)
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
                    res.send({"StatusCode" : "422" ,"Message" : "Invalid entity"});                            
                }
            }
        }
     else
        {
            res.send({"StatusCode" : "422" ,"Message" : "Invalid entity"});                            
        }
     });
}

/*exports.getUserCountInLastWeek = function(req,res)
{
    var input = req.body;
    var end =new Date();
    var start = new Date(end.getTime() - (7 * 24 * 60 * 60 * 1000));
console.log(end);
console.log(start);
    UsersCollection.find({"CreateDate": {"$gte": start, "$lt": end}}).count().exec(
        function(err,result)
     {
        if(err)
            res.send(result);      
        else
            res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  
     });
}

exports.getUserCountBeforeLastWeek = function(req,res)
{
    var input = req.body;
    var end =new Date();
    var start = new Date(end.getTime() - (7 * 24 * 60 * 60 * 1000));

    UsersCollection.find({"CreateDate": {"$lt": start}}).count().exec(
        function(err,result)
     {
        if(err)
            res.send(result);      
        else
            res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  
     });
}
*/

/* INPUT
{
  "fromDate":["2015","06","15"],
  "countType":"Weekly"
}
*/
//number of new users Weekly, Monthly and Daily.
exports.getNewUserCount_Weekly_Monthly_Daily = function(req,res)
{
    var input = req.body;
    var _fromDate = input.fromDate;

    var countType=input.countType;
   
    if(countType=="Daily")
    {
      var fromDate = new Date(parseInt(_fromDate[0]),parseInt(_fromDate[1])-1,parseInt(_fromDate[2]));
      var endDate = new Date(parseInt(_fromDate[0]),parseInt(_fromDate[1])-1,parseInt(_fromDate[2])+1);
     
      UsersCollection.find({"CreateDate": {"$gte": fromDate, "$lt": endDate}}).count().exec(
                function(err,result)
             {
                if(err)
                    res.send(result);      
                else
                    res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  
             });
    }
    else if(countType=="Weekly")
    {
        var curr = new Date(parseInt(_fromDate[0]),parseInt(_fromDate[1])-1,parseInt(_fromDate[2]));
        var currDay=curr.getDay();
        var firstday = new Date(curr.getTime() - ((parseInt(currDay)-1) * 24 * 60 * 60 * 1000));
        var lastday = new Date(curr.getTime() + ((7-parseInt(currDay)) * 24 * 60 * 60 * 1000));

        //console.log(currDay);
        //console.log(firstday);
        //console.log(lastday);

        UsersCollection.find({"CreateDate": {"$gte": firstday, "$lte": lastday}}).count().exec(
        function(err,result)
         {
            if(err)
                res.send(result);      
            else
                res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  
         });
    }
    else
    {
        var startDate=new Date(parseInt(_fromDate[0]),parseInt(_fromDate[1])-1,1);
        var endDate=new Date(parseInt(_fromDate[0]),parseInt(_fromDate[1])-1,new Date(parseInt(_fromDate[0]),parseInt(_fromDate[1]), 0).getDate());
       
        UsersCollection.find({"CreateDate": {"$gte": startDate, "$lte": endDate}}).count().exec(
        function(err,result)
         {
            if(err)
                res.send(result);      
            else
                res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  
         });
    }
    
}