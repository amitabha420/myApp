var StatContentAccessSchema = require('./DbCollections.js').StatContentAccessSchema;

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

exports.GetAccessFrequencyBteDays = function (req,res)
{
	
}