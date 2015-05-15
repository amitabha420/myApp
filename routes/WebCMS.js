
var UsersCollection = require('./DbCollections.js').UsersCollection;
var AdminUsersSchema = require('./DbCollections.js').AdminUsersSchema;
var GeoLocationCollection = require('./DbCollections.js').GeoLocationSchema;
var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;
var async = require('async');

var defaultConfig = require('../defaultConfig.json');


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

exports.GetLocationsOfChannel_v1 = function(req,res)
{
    var input = req.body;
    //console.log('hi');
    var ObjectId = require('mongoose').Types.ObjectId;
    GeoLocationCollection.find({"ChannelId" : ObjectId(input.ChannelId)},
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