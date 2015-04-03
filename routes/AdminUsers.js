var adminUsersSchema = require('./DbCollections.js').AdminUsersSchema;


//need to add admin user user name validation.
exports.Create = function(req,res)
{
    var obj = req.body;

    //console.log(obj.User + ',' + obj.password);
    var adminuser = new adminUsersSchema();
    adminuser.User = obj.User;
    adminuser.password = obj.password;
    adminuser.IsSuperAdmin = false;
    adminuser.IsApp = false ;
    adminuser.AppName = '';

    adminuser.save(function (err, obj) {
        if (err) 
        {
            console.log(err);// ...
            res.send({"_id" : "" , "StatusCode" : "500","Message" : "Internal server error"});
            return;
        }

        var responseObj = {"_id" : obj._id , "StatusCode" : "200", "Message" : "OK"};
        res.send(responseObj);
    });
}

/*
exports.Edit = function(req,res)
{
    var input = req.body;

    var adminuser = new AdminUsersSchema({
        "Name": input.Name,
    	"Description": input.Description,
    });
    
    AdminUsersSchema.findById( new ObjectID(input._id), function(err,obj) 
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
    
}*/