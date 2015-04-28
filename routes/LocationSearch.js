var GeoLocationSchema = require('./DbCollections.js').GeoLocationSchema;
var async = require('async');


//This Function takes argument 1. a coordinate 2. limit of response array.
//OutPut: It will return the nearest 20 locations in 50 Km radius of the coordinate send.
/*INPUT
{
  "lat": "88.429840207092",
  "lng": "22.568980095843",
  "limit": "2"
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
  GeoLocationSchema.find(
  {
    loc : {
      $near : {
        $geometry : { 
          type : "Point" , 
          coordinates : coordinate  
        }, 
        $maxDistance : 100000
      }
    }
  }
  ,
  {
    
    ChannelName : 1,
    ChannelId : 1,
    BannerImageUrl : 1,
    LocationName : 1,
    _id : 1,
    UserId : 1,
    Notification : 1,
    'Matchpoint' : 1,
    'loc' : 1,
  },
  { skip: 0, limit: limit },
  function(err,result)
  {
    if(err)
      {
        res.send({"result" : "", "StatusCode" : 500 ,"Message" : "Internal server error"});
      }
      else
      {
        res.send({"result" : result , "StatusCode" : 200 ,"Message" : "OK"});
      }
  }
);

}



/*INPUT
{
  "channelid" : "552295e8a496af1c215a7236",
}

OUTPUT : will be only digital contents.
*/
exports.GetContents = function(req,res)
{
	var input = req.body;
	//var locationid = new ObjectId(input.locationid);

  GeoLocationSchema.aggregate([
                              { $match : { "ChannelId" : input.channelid }},
                              {
                                  $project : {    "contents" : "$Digitalcontents", 
                                                  "Location" : "$LocationName",
                                                  "LocationId" : "$_id",
                                                  "CentralCoordinate" : "$Matchpoint.coordinates",
                                                  "BannerUrl" : "$BannerImageUrl",
                                                   "_id" : 0
                                                }
                              }
                              ],function(error,result)
                              {
                                if(error)
                                {
                                  res.send({"result" : "", "StatusCode" : 500 ,"Message" : "Internal server error"});
                                }
                                else
                                {
                                  res.send({"result" : result , "StatusCode" : 200 ,"Message" : "OK"});
                                }
                              })
}



/*{
  "locationid" : "553e0299b8f249bc09444ca7"
}*/
exports.GetContentsOfSpecificLocation = function(req,res)
{
  var input = req.body;
  var ObjectId = require('mongoose').Types.ObjectId;
  var locationid = new ObjectId(input.locationid);
 

 GeoLocationSchema.findOne({_id : locationid },
                            {
                                
                                                Digitalcontents : 1,
                                                LocationName : 1,
                                                _id : 1,
                                                Matchpoint : 1,
                                                BannerImageUrl : 1,
                                    
                            },function(error,result){
                              if(error)
                                {
                                  res.send({"result" : "", "StatusCode" : 500 ,"Message" : "Internal server error"});
                                }
                                else
                                {
                                  res.send({"result" : result , "StatusCode" : 200 ,"Message" : "OK"});
                                }

                            }
                            );
}


/* Get Content of a particular location
db.GeoLocations.findOne({_id : ObjectId("553e0299b8f249bc09444ca7") },
{
    
                    Digitalcontents : 1,
                    LocationName : 1,
                    _id : 1,
                    Matchpoint : 1,
                    BannerImageUrl : 1,
        
}
)
*/