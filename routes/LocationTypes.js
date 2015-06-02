var LocationType = require('./DbCollections.js').LocationTypeSchema;



//Create Location Type
/*
INPUT
{
  "LocationType" : "Park"
}
*/
exports.CreateLocationType = function(req,res)
{
    var input = req.body;
    var contentobj = new LocationType();
    contentobj.LocationType = input.LocationType;

    LocationType.findOne({ LocationType:input.LocationType},function(error,result)
    	{
    		if(error)
    			res.send({"StatusCode" : "500" ,"Message" : "Internal server error"});             
    		else
    		{
    			if(!result)
    			{
    				contentobj.save(function(err,obj)
			    	{
			    		if(err)
			    			res.send({"result" : "" ,"StatusCode" : "500" ,"Message" : "Internal server error"});             
			    		else
			    			res.send({"result" : obj,"StatusCode" : "200" ,"Message" : "OK"});             
			    	});	
    			}
    			else
    			{
					res.send({"result" : result,"StatusCode" : "200" ,"Message" : "OK"});             
    			}
    		}
    	});
}


/*
INPUT (NONE)
Get all Location Type
*/
exports.getLocationType = function(req,res)
{
 	var input = req.body;
 
    LocationType.find({},
        {
            "LocationType" : 1,
            "_id"          : 1
        },
     function(err,result)
     {
     	if(err)
			res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});      
		else
        	res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  
     });
}



/* remove location type by Id
INPUT 
{
	"_id" : "556dc4579a55523c2cc84b89"
}
*/
exports.removeLocationTypeById = function(req,res)
{
	 var input = req.body;
     var ObjectId = require('mongoose').Types.ObjectId;
    LocationType.remove({_id : ObjectId(input._id) },
        
     function(err,result)
     {
     	if(err)
			res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});      
		else
        	res.status(200).send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  
     });
}