var emailvalidator = require("email-validator");
var UsersCollection = require('./DbCollections.js').UsersCollection;

exports.Test = function(req,res)
{
    res.send('Test the api is ok...response code 200');
}

exports.Register = function (req, res) {
    
    var userobj = req.body;
    
    //console.log('Adding wine: ' + JSON.stringify(userobj));
    
    //validations : 
    if(userobj.profiletype === 'manual')
    {
        console.log(emailvalidator.validate(userobj.email));
        if(!emailvalidator.validate(userobj.email))
        {
            //res.setHeader(name, value)
            res.send({"_id" : "" , "StatusCode" : "201"});
            return;
        }
        // if(userobj.gender != 'male' || userobj.gender != 'female')
        // {
        //     res.send({"_id" : "" , "StatusCode" : "202"});
        //     return;
        // }
    }
    


    var User = new UsersCollection({
        "email": userobj.email,
    	"gender": userobj.gender,
    	"age": userobj.age,
    	"profiletype": userobj.profiletype,
    	"token" : userobj.token
    });
    
    User.save(function (err, obj) {
        if (err) 
        {
            console.log(err);// ...
            res.send({"_id" : "" , "StatusCode" : "500"});
        }

        var responseObj = {"_id" : obj._id , "StatusCode" : "200"};
        res.send(responseObj);
    });
}


exports.SocialLoggin = function (req, res) {
    
    var userobj = req.body;
    
    UsersCollection.findOne({token: userobj.token}, function(err,obj) 
        {
          res.send(obj);
        });
}

exports.Loggin = function (req, res) {
    
    var userobj = req.body;
    
    UsersCollection.findOne({email: userobj.email}, function(err,obj) 
        {
          res.send(obj);
        });
}