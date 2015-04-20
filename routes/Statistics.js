var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;
var StatSyncSpotSchema = require('./DbCollections.js').StatSyncSpotSchema;


//Input
/*
{
         "userid" : "552688594401bb2324f1d3b4",
         "channeladminid":"552facea8a5ec0b0060bf3ae",
         "locationid" : "552fc6fb8a5ec0b0060bf3b0",
         "contenturl" : "http://en.wikipedia.org/w/index.php?title=Special:DoubleRedirects&limit=20&offset=0",
         "contentName" : "Example4"
            
 }
*/
exports.EnlistContentAccess = function(req,res)
{

	var input = req.body;

	var StatContentAccess = new StatContentAccessSchema();
	StatContentAccess.userid = input.userid;
	StatContentAccess.channeladminid = input.channeladminid;
	StatContentAccess.locationid = input.locationid;
	StatContentAccess.contenturl = input.contenturl;
	StatContentAccess.contentName = input.contentName;

	StatContentAccess.save(function(err,obj)
		{
			if(err)
			    res.send({"StatusCode" : "500" ,"Message" : "Internal server error"});             
			else
			    res.send({"StatusCode" : "200" ,"Message" : "OK"});             
		});
}

exports.GetContentAccessFrequencyByeDays = function (req,res)
{
	
}


/*
{
         "userid" : "552688594401bb2324f1d3b4"           
 }
*/
exports.GetUserContentAccessFrequencyDetails = function (req,res)
{
	console.log('amitabha');
	//res.send('ok');
	
	var input = req.body;

	StatContentAccessSchema.aggregate(
	   [{
	            //$match :{CreateDate : {$gt :toDate, $lte : fromDate}}
	            $match : { userid : input.userid }
	   },
	   {"$project" : {  
	            "contentName" : "$contentName",

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
	            "contentName" : "$contentName",

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
	        $group : {
	           _id :  {
	                        "contentName" : "$contentName",
	                        "Date" : "$date"
	                  },
	                      
	                    count: { $sum: 1 }
	        }
	      }

	 
	   ],function(err,obj){
	   		if(err)
			    res.send({"result" : "" ,"StatusCode" : "500" ,"Message" : "Internal server error"});             
			else
			    res.send({"resultobj" : obj , "StatusCode" : "200" ,"Message" : "OK"});  
	   })
}

exports.SetUserInSyncSpot = function (req,res)
{
	var input = req.body;


	var StatSyncSpotObj = new StatSyncSpotSchema();

	StatSyncSpotObj.UserName = input.UserName;
	StatSyncSpotObj.UserId = input.UserId;
	StatSyncSpotObj.SyncSpotId = input.SyncSpotId;
	StatSyncSpotObj.SyncSpotName = input.SyncSpotName;
	StatSyncSpotObj.ChannelId = input.ChannelId;
	StatSyncSpotObj.ChannelName = input.ChannelName;
	StatSyncSpotObj.SyncSpotOutTime = '';

	StatSyncSpotObj.save(function(err,obj)
		{
			if(err)
			    res.send({"_id" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
			else
			    res.send({"_id" : obj._id, "StatusCode" : "200" ,"Message" : "OK"});  	
		});
}

exports.SetUserOutSyncSpot = function (req,res)
{
	var input = req.body;
	var ObjectId = require('mongoose').Types.ObjectId;
	var ID = new ObjectId(input.ID);

	StatSyncSpotSchema.update(
   								{ _id: ID },
   								{ $currentDate: { SyncSpotOutTime: true } },
   								{ multi: false },
   								function(error,result)
   								{
   									if(error)
									    res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
									else
									    res.send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  	
   								}
							);
}

exports.GetSyncSpotStatisticsBetweenDate = function(req,res)
{
	var input = req.body;
	//var ISODate = require('mongoose').Types.ISODate;
	//console.log(ISODate);
	var fromDate = new Date(2015,3,20);
	var toDate = new Date(2015,3,19);
	//var toDate = new Date();
	//toDate.setDate

	/*
	

	var cutoff = new Date();
	cutoff.setDate(cutoff.getDate()-1);
	console.log(cutoff);
	StatSyncSpotSchema.find({SyncSpotInTime: {$gte: fromDate}}, function (err, docs) { 
		if(err)
				res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
			else
				res.send({"result" : docs, "StatusCode" : "200" ,"Message" : "OK"});  	
	});*/
	console.log(fromDate); 
	StatSyncSpotSchema.aggregate(
	   [{
	            //$match :{CreateDate : {$gt :toDate, $lte : fromDate}}  SyncSpotId : input.SyncSpotId,
	            $match : { SyncSpotInTime: { $lte : fromDate}}
	   },
	   {"$project" : {  
	            "SyncSpotId" : "$SyncSpotId",
                    "SyncSpotName" : "$SyncSpotName",
	           "date" : "$SyncSpotInTime",  
	           "_id" : 0,  
	           "h" : {  
	                "$hour" : "$SyncSpotInTime"  
	           },  
	           "m" : {  
	                "$minute" : "$SyncSpotInTime"  
	           },  
	           "s" : {  
	                "$second" : "$SyncSpotInTime"  
	           },  
	           "ml" : {  
	                "$millisecond" : "$SyncSpotInTime"  
	           }  
	      }
	},
	{"$project" : {     
	            "SyncSpotName" : "$SyncSpotName",
                    "SyncSpotId" : "$SyncSpotId",
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
	        $group : 
                {
	           _id :  {
	                        "SyncSpotId" : "$SyncSpotId",
                                "SyncSpotName" : "$SyncSpotName",
	                        "Date" : "$date"
	                  },
	                      
                    count: { $sum: 1 }
	        }
	 },
         {
             $project : 
             {
                 "SyncSpotName" : "$_id.SyncSpotName",
                 "Date" : "$_id.Date",
                 "Count" : "$count",
                 _id : 0
             }
         }

	 
	   ],function(error,result)
	   {
	   		if(error)
				res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
			else
				res.send({"result" : result, "StatusCode" : "200" ,"Message" : "OK"});  	
	   });
}