var emailvalidator = require("email-validator");
var async = require('async');
var UsersCollection = require('./DbCollections.js').UsersCollection;

exports.Test = function(req,res)
{
    res.send('Test the api is ok...response code 200');
}

exports.Register = function (req, res) 
{
    
    var userobj = req.body;

    var StatusCode = 200;

    //validations : 
    //201 : invalid email
    //202 : invalid phone no
    //203 : user already exists
    if(userobj.profiletype === 'manual')
    {
        //console.log('isNaN' + isNaN(userobj.email));

        if(isNaN(userobj.email)) //check if it is not a number
        {
            if(!emailvalidator.validate(userobj.email))
            {
                StatusCode = "201";
            }
        }
        else //It is a phono no of 10 digit or not
        {
            var phoneno = /^\d{10}$/;  
            if(!userobj.email.match(phoneno))  
            {
                StatusCode = "202";
            }
        }
    }

        //check user already exists
        async.series([
        
        function(callback) {
            if(userobj.profiletype == 'manual')
            {
                UsersCollection.find({email: userobj.email}, function(err,obj) 
                {
                    if (err) { StatusCode = 500; }
                    if(obj.length != 0)
                        StatusCode = 203;
                        //return callback(new Error('user exists.'));
                    callback();
                })
            }
            else
            {
                UsersCollection.find({token: userobj.token}, function(err,obj) 
                {
                    if (err) { StatusCode = 500; }
                    if(obj.length != 0)
                        StatusCode = 203;
                        //return callback(new Error('user exists.'));
                    console.log(StatusCode);
                    callback();
                })
            }
            
        }, //1st function end

        ], //end of function serize
            function(err) { //This function gets called after the two tasks have called their "task callbacks"

            if(StatusCode == 201)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode ,"Message" : "Invalid email"});
            }
            else if(StatusCode == 202)
            {
                res.send({"_id" : "" , "StatusCode" : StatusCode ,"Message" : "Invalid phone no"});
            }
            else if(StatusCode == 203)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode , "Message" : "User already exists"});
            }
            else if(StatusCode == 500)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode, "Message" : "User already exists"});
            }
            else
            {
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
                        res.send({"_id" : "" , "StatusCode" : "500",  "Message" : "Internal server error"});
                    }
                    else
                    {
                        var responseObj = {"_id" : obj._id , "StatusCode" : "200", "Message" : "OK"};
                        res.send(responseObj);    
                    }
                });
            }
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