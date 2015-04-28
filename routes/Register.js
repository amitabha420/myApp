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
    var __id = '';

    //validations : 
    //201 : invalid email
    //202 : invalid phone no
    //203 : user already registered
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
                UsersCollection.findOne({email: userobj.email}, function(err,obj) 
                {
                    if (err) { StatusCode = 500; }
                    if(obj != null)
                    {
                        StatusCode = 203;
                        __id = obj._id;
                    }
                        //return callback(new Error('user exists.'));
                    callback();
                })
            }
            else
            {
                UsersCollection.findOne({token: userobj.token}, function(err,obj) 
                {
                    if (err) { StatusCode = 500; }
                    if(obj != null)
                    {
                        StatusCode = 203;
                        __id = obj._id;
                    }
                        //return callback(new Error('user exists.'));
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
                res.send({"_id" : __id, "StatusCode" : StatusCode , "Message" : "user already registered"});
            }
            else if(StatusCode == 500)
            {
                res.send({"_id" : "", "StatusCode" : StatusCode, "Message" : "Internal server error"});
            }
            else
            {
                var randomPassword = Math.floor(Math.random() * (99999 - 10000 + 1)) + 10000;
                console.log(randomPassword);
                var User = new UsersCollection({
                "email": userobj.email,
                "password" : userobj.password,
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
                        var responseObj = {"_id" : obj._id , "StatusCode" : "200", "Message" : "Congratulations! You have successfully registered with SyncSpot."};
                        res.send(responseObj);    
                    }
                });
            }
        });
} 

exports.updateRegistration = function(req,res)
{
    var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;

    if(!ObjectId.isValid(input._userid))
    {
        res.send({"StatusCode" : "401",  "Message" : "Invalid ObjectId format"});
    }
    else
    {
        var _userid =  ObjectId(input._userid); 
    
        UsersCollection.findOne({_id : _userid}, function(err,obj)   //, password : input.OldPassword
        {
            if(err)
            {
                res.send({"StatusCode" : "500",  "Message" : "Internal server error"});
            }
            else
            {
                if(obj!=null)
                {
                    obj.firstName = input.firstName;
                    obj.lastName = input.lastName;
                    obj.gender = input.gender;
                    obj.age = input.age;
                    obj.profiletype = input.profiletype,
                    obj.token = input.token;

                    obj.save(function(error,result)
                    {
                        if(err)
                        {
                            res.send({"StatusCode" : "500",  "Message" : "Internal server error"});
                        }
                        else
                        {
                            res.send({"StatusCode" : "200",  "Message" : "OK"});
                        }
                    });
                }
                else
                {
                    res.send({"StatusCode" : "404",  "Message" : "Data is not valid"});
                }
                
            }
        });
    }

    
}


exports.Loggin = function (req, res) {
    
    var userobj = req.body;
    
    var response = {
        StatusCode : 200,
        Message : 'You have logged in successfully.',
        email : '',
        gender : '',
        age: '',
        profiletype: 'manual',
        token : '',
        _id : ''
    };

    async.series([
        
        function(callback) {

            UsersCollection.findOne({email: userobj.email,password : userobj.password}, function(err,obj) 
            {
                if(err)
                {
                    response.StatusCode = 500;
                    response.Message = 'Internal server error';
                }
                else
                {
                    //console.log(JSON.stringify(obj));
                    if(obj != null )
                    {
                        response.email = obj.email;
                        response.gender = obj.gender;
                        response.age = obj.age;
                        response.profiletype = obj.profiletype;
                        response._id = obj._id;
                    }
                    else
                    {
                        response.StatusCode = 404;
                        response.Message = 'Invalid loggin credential';
                    }
                }
                
               callback();
            })
            
        }, //1st function end

        ], //end of function serize
            function(err) { //This function gets called after the two tasks have called their "task callbacks"

            res.send(response);
        })
}

exports.getUserDetails = function(req,res)
{
    var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;

    if(!ObjectId.isValid(input._userid))
    {
        res.send({"StatusCode" : "401",  "Message" : "Invalid ObjectId format"});
    }
    else
    {
        var _userid =  ObjectId(input._userid); 

        UsersCollection.findOne({_id : _userid},
                                 {
                                     firstName : 1,
                                     lastName : 1,
                                     email : 1,
                                     password : 1,
                                     gender : 1,
                                     age : 1,
                                     prototype : 1,
                                     token : 1,
                                     _id : 0
                                 },
                                 function(err,obj)
                                 {
                                    if(err)
                                    {
                                        res.send({"result" : "", "StatusCode" : "500" ,"Message" : "Internal server error"});             
                                    }
                                    else
                                    {
                                        res.send({"result" : obj, "StatusCode" : "200" ,"Message" : "OK"});             
                                    }
                                 }
                    );
    }
}

exports.changePassword = function(req,res)
{
     var input = req.body;
    var ObjectId = require('mongoose').Types.ObjectId;

    if(!ObjectId.isValid(input._userid))
    {
        res.send({"StatusCode" : "401",  "Message" : "Invalid ObjectId format"});
    }
    else
    {
        var _userid =  ObjectId(input._userid); 


        UsersCollection.findOne({_id : _userid,password:input.OldPassword},
                                 function(err,result)
                                 {
                                    result.password = input.NewPassword;
                                    result.save(function(err1,result)
                                    {
                                        if(err1)
                                        {
                                            res.send({"StatusCode" : "500" ,"Message" : "Internal server error"});             
                                        }
                                        else
                                        {
                                            res.send({"StatusCode" : "200" ,"Message" : "OK"});             
                                        }    
                                    });
                                    
                                 }
                    );
    }
    
}