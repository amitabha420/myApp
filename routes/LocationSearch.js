var GeoLocationSchema = require('./DbCollections.js').GeoLocationSchema;
var UserContentAccessHistorySchema = require('./DbCollections.js').UserContentAccessHistorySchema;
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
  var distance = parseInt(input.distance);
  var coordinate = [lng,lat];

  //console.log(parseFloat("5.265"));
  //console.log(lat + "," + lng);

  GeoLocationSchema.find(
  {
    loc : {
      $near : {
        $geometry : { 
          type : "Point" , 
          coordinates : coordinate  
        }, 
        $maxDistance : distance
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

        /*  Put all locations for a channel in a single object of the resulting array.
        var finalobject = [];
        var output = getUnique(result);
        for (var i = 0; i <= output.length-1; i++) 
        {

            var ss = new Object();
            ss.locations = [];
            for (var j = 0; j <= result.length-1; j++) 
            {

              if(result[j].ChannelId == output[i])  //find same channel one by one in result and add to finalobject
              {
                console.log(result[j].BannerImageUrl);
                
                ss.BannerImageUrl = result[j].BannerImageUrl;
                ss.ChannelId = result[j].ChannelId;
                ss.ChannelName = result[j].ChannelName;

                var loc = new Object();
                loc._id = result[j]._id;
                loc.Notification = result[j].Notification;
                loc.LocationName = result[j].LocationName;
                loc.UserId = result[j].UserId;
                loc.Matchpoint = result[j].Matchpoint;
                loc.loc = result[j].loc;

                ss.locations.push(loc);
              }
              
            };
            finalobject.push(ss);
        };*/
        
        res.send({"result" : result , "StatusCode" : 200 ,"Message" : "OK"});
      }
  }
);

}


function getUnique(result){
   var u = {}, a = [];
   for(var i = 0, l = result.length; i < l; ++i){
      if(u.hasOwnProperty(result[i].ChannelId)) {
         continue;
      }
      a.push(result[i].ChannelId);
      u[result[i].ChannelId] = 1;
   }
   return a;
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