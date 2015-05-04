var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;
var StatSyncSpotSchema = require('./DbCollections.js').StatSyncSpotSchema;
var async = require('async');



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*This API will be called whenever a content accessed by a user only if "MaxAccessValue" is not set for the content.
If MaxAccessValue exists for the particular content then API "lockContent" will be called instead of this one.

Input

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
	StatContentAccess.contentid = input.contentid;

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







/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*This API will provide a statistical data for a user regarding "Datewise content access count by the user".
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


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
This API will be called whenever an user get in to a SyncSpot.
*/
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






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*This API will be called whenever an user is get out from a SyncSpot */
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






/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*
This API will provide no of access of a particular suncspot between 2 days.
condition is : Where SyncSpot = ID and (Date > fromdate and Date <= toDate)
*/ 
exports.GetSyncSpotStatisticsBetweenDate = function(req,res)
{
	var input = req.body;
	
	var _fromDate = input.fromDate;
	var _toDate = input.toDate;
	//res.send('hello');
	//console.log(_fromDate.length);
	var fromDate = new Date(parseInt(_fromDate[0]),parseInt(_fromDate[1]),parseInt(_fromDate[2]));
	var toDate = new Date(parseInt(_toDate[0]),parseInt(_toDate[1]),parseInt(_toDate[2]));
	
	//console.log(fromDate); 
	//console.log(toDate);
	//console.log(input.SyncSpotId);

	StatSyncSpotSchema.aggregate(
	   [{
	            //$match :{CreateDate : {$gt :toDate, $lte : fromDate}}  SyncSpotId : input.SyncSpotId,
	            $match : { SyncSpotId : input.SyncSpotId, SyncSpotInTime: {$gt : fromDate, $lte : toDate }}
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

/*
exports.callstoredFunction = function(req,res)
{
	var mongoose = require('./DbCollections.js').mongoose;
	/*
	mongoose.connection.db.eval("TEST()",[5],function(err,obj){
		console.log(JSON.stringify(obj));
		res.send('ok');
		//console.log(err);
	});
	

	mongoose.connection.db.eval("function(val) { return val;}",5,function(err,obj){
		console.log(JSON.stringify(obj));
		res.send(obj);
		//console.log(err);
	});
}*/



/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/*********************SUMMERY**********************/
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/* INPUT
{
    "MaxAccessValue" : 2,  //This is value set by admin
    "userid" : "52688594401bb2324f1d3b1",
    "channeladminid":"552facea8a5ec0b0060bf3ae",
    "locationid" : "552fc6fb8a5ec0b0060bf3b0",
    "contenturl" : "http://en.wikipedia.org/w/index.php?title=Special:DoubleRedirects&limit=20&offset=0",
    "contentName" : "Example4aaa"
 }
 

This lock/unlock API provide permission for content access to a user depending on toatal user access count set by admin for
each day.
 */
exports.lockContent = function(req,res)
{
	
var input = req.body;
var MaxAccessValue = input.MaxAccessValue;
	
	
var dt = new Date();  //Todays date
console.log(new Date(dt.getYear(),dt.getMonth(),dt.getDate()));

var d = new Date(dt.getYear(),dt.getMonth(),dt.getDate());

async.waterfall([
        
        function(callback) {
        	//Get the count of the content used by today
            StatContentAccessSchema.aggregate([
                             {
                             		$match : {
                             		     	  CreateDate:{$gte:d},
                                             "contenturl" : input.contenturl,
                                             "contentName" : input.contentName,
                                             "locationid" : input.locationid
                                         }
                             },
                            		{"$project" : {  
                                               "userid" : "$userid",
                                               "contentName" : "$contentName",
                                               "contenturl" : "$contenturl",
                                               "locationid" : "$locationid",
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
                                               "userid" : "$userid",
                                               "contentName" : "$contentName",
                                               "contenturl" : "$contenturl",
                                               "locationid" : "$locationid",
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
                                                                    
                                                                    //"userid" : "$userid",
                                                                    "contentName" : "$contentName",
                                                                    "contenturl" : "$contenturl",
                                                                    "locationid" : "$locationid",
                                                                    "Date" : "$date"
                                                              },
                                                                  
                                                        count: { $sum: 1 }
                                                    }
                                        },
                                        {
                                             $project : 
                                             {
                                                 "contentName" : "$_id.contentName",
                                                 "Count" : "$count",
                                                 _id : 0
                                             }
                                         }
							],function(error,result)
							{
								//console.log("count : " + result[0].Count);//JSON.stringify(result));
								var _totalcount = 0;
								if(result.length > 0)
								{
									
									if(error)
										_totalcount = -1;
									else
										_totalcount = result[0].Count;	
								}
								callback(null,_totalcount);
							});
        }, //1st function end

        function( _totalcount,callback) {
        	
        	console.log("2nd :" +  _totalcount + "max :" + MaxAccessValue);

        	var permission = true;
        	var insertToDb = true;

        		//need to add more fields
        		StatContentAccessSchema.findOne(
        			{
        				"userid":input.userid,
        				"CreateDate" : {$gte:d},
        				"contenturl" : input.contenturl,
                        "contentName" : input.contentName,
                        "locationid" : input.locationid
        			},
	        	function(error,result)
	        	{

	        		if(error)
	        		{
	        			permission = false;
	        			insertToDb = false;
	        		}
	        		else
	        		{
	        			/*When a user already access the content and he/she is enlisted in our data base, then he/she can access the
	        			content for that day and no new database enlist is required.
	        			*/
	        			if(result != null)
	        			{
	        				permission = true;
	        				insertToDb = false;
	        			}
	        			else
	        			{
	        				if(_totalcount == MaxAccessValue)
	        				{
	        					insertToDb = false;
	        					permission = false;
	        				}
	        				else
	        				{
	        					insertToDb = true;
	        					permission = true;
	        				}
	        			}
	        		}
	        		callback(null,permission,insertToDb);
	        	});
        }, //2nd function end
        
        ], //end of function serize
            function(err,permission,insertToDb) { //This function gets called after the two tasks have called their "task callbacks"


            //console.log("3rd " + result + ":" + result1);
            if(insertToDb)
            {
            	var StatContentAccess = new StatContentAccessSchema();
				StatContentAccess.userid = input.userid;
				StatContentAccess.channeladminid = input.channeladminid;
				StatContentAccess.locationid = input.locationid;
				StatContentAccess.contenturl = input.contenturl;
				StatContentAccess.contentName = input.contentName;

				StatContentAccess.save(function(err,obj)
					{
						if(err)
						    res.send({"Permission": "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
						else
						    res.send({"Permission": permission, "StatusCode" : "200" ,"Message" : "OK"});             
					});
            }
            else
            {
            	res.send({"Permission": permission, "StatusCode" : "200" ,"Message" : "OK"});   
            }
            
    });

}

