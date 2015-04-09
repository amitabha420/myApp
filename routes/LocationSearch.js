var adminUsersSchema = require('./DbCollections.js').AdminUsersSchema;
var async = require('async');
//var mongoose = require('mongoose');


//This API is returning all the channels data from database. 
//It will not be using in feature. Just do not delete for the query reference.
//No input parameter required.
exports.GetAllLocations = function(req,res)
{
	//var obj = adminUsersSchema.find({},{"Channel.GeoFencingData":1});
	var obj = adminUsersSchema.aggregate([
								{$project : {"GeoFencingData": "$Channel.GeoFencingData" ,_id:0}}
										],function(err,result){

											//console.log(JSON.stringify(result));
											res.send(result);
										});
}


//This Function takes argument 1. a coordinate 2. limit of response array.
//OutPut: It will return the nearest 20 locations in 50 Km radius of the coordinate send.
/*INPUT
{
  "lat":27.957108,
  "lng":78.239136,
  "limit":20
}
*/
exports.GeoLocations = function(req,res)
{
	var input = req.body;
  var lat = parseFloat(input.lat);
  var lng = parseFloat(input.lng);
  var limit = parseInt(input.limit);
	var coordinate = [lat,lng];

  //console.log(parseFloat("5.265"));
  //console.log(lat + "," + lng);

	//console.log(coordinate);

	adminUsersSchema.aggregate(
                            [{ $match :{'Channel.GeoFencingData.Loc': 
                                            {
                                                $geoNear : 
                                                {
                                                    $geometry: {"type": "Point", coordinates: coordinate},
                                                    $maxDistance: 50 / 6378137, 
                                                    distanceMultiplier: 6378137
                                                 }
                                            }
                                       }
                             },
                            { 
                                $project: 
                                    { 
                                          "Channel.GeoFencingData.Loc.coordinates" : 1,
                                          "Channel.ChannelName" : 1,
                                          "Channel._id" : 1,
                                          "Channel.BannerImageUrl" : 1,
                                          "Channel.GeoFencingData.LocationName"  : 1,
                                          "Channel.GeoFencingData._id"  : 1 ,
                                           _id:0
                                    }
                            },
                            { $limit : limit }
                    ],function(err,result)
                    {
                    	if(err)
                    	{
                    		res.send({"result" : err, "StatusCode" : 500 ,"Message" : "Internal server error"});
                    	}
                    	else
                    	{
                    		res.send({"result" : result , "StatusCode" : 200 ,"Message" : "OK"});
                    	}
                    });
	//res.send('Ok');
}


/*INPUT
{
  "channelid" : "552295e8a496af1c215a7236",
  "locationid" : "55229660a496af1c215a7238"
}

OUTPUT : will be only digital contents.
*/
exports.GetContents = function(req,res)
{
	var input = req.body;
	var ObjectId = require('mongoose').Types.ObjectId;
	var channelid = new ObjectId(input.channelid);
	//var locationid = new ObjectId(input.locationid);

  console.log(channelid);

/* 
adminUsersSchema.aggregate([
     { $unwind : "$Channel" },
     { $unwind : "$Channel.GeoFencingData" },
     { $match : {"Channel._id" : channelid, "Channel.GeoFencingData._id":locationid}},
     { $project : {contents : "$Channel.GeoFencingData.Digitalcontents", _id : 0}},
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
*/
adminUsersSchema.aggregate([
     { $unwind : "$Channel" },
     { $unwind : "$Channel.GeoFencingData" },
     { $match : { "Channel._id" : channelid }},
     { $project : { "contents" : "$Channel.GeoFencingData.Digitalcontents", "Location" : "$Channel.GeoFencingData.LocationName", "_id" : 0}},
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