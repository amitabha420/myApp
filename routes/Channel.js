var ChannelCollection = require('./DbCollections.js').ChannelCollection;

exports.Create = function(req,res)
{
    var obj = req.body;

    var channel = new ChannelCollection({
        "Name": obj.Name,
    	"Description": obj.Description,
    	
    });

    channel.save(function (err, obj) {
        if (err) 
        {
            console.log(err);// ...
            res.send({"_id" : "" , "StatusCode" : "500"});
            return;
        }

        var responseObj = {"_id" : obj._id , "StatusCode" : "200"};
        res.send(responseObj);
    });
}

exports.Edit = function(req,res)
{
    var input = req.body;

    var channel = new ChannelCollection({
        "Name": input.Name,
    	"Description": input.Description,
    });
    
    ChannelCollection.findById( new ObjectID(input._id), function(err,obj) 
        {
        	if (err) 
        	{
            	console.log(err);// ...
            	res.send({"_id" : new ObjectID(input._id) , "StatusCode" : "500"});
            	return;
        	}
          res.send(obj);
        });

    /*
    channel.save(function (err, obj) {
        if (err) 
        {
            console.log(err);// ...
            res.send({"_id" : "" , "StatusCode" : "500"});
            return;
        }

        var responseObj = {"_id" : obj._id , "StatusCode" : "200"};
        res.send(responseObj);
    });
    */
}