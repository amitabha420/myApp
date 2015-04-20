var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;


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