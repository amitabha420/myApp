module.exports = function(req, res, next) {
 
  // When performing a cross domain request, you will recieve
  // a preflighted request first. This is to check if our the app
  // is safe. 
 
  // We skip the token outh for [OPTIONS] requests.
  //if(req.method == 'OPTIONS') next();
  var token = (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
  //var key = (req.body && req.body.x_key) || (req.query && req.query.x_key) || req.headers['x-key'];
 
  var ValidateUserCollection = require('../routes/DbCollections.js').ValidateUserCollection;
  var ObjectId = require('mongoose').Types.ObjectId;
  var moment = require('moment');

  //skip the checking for the below functions
  var lastPart = req.path.split("/").pop().toLowerCase();

  //need to comment this console
  console.log(lastPart);
  if((lastPart === 'adminloggin') || (lastPart === 'superadminloggin'))
  {
     next(); // To move to next middleware
  }
  else
  {
    
      var jwt = require('jwt-simple'); //--
      var defaultConfig = require('../defaultConfig.json');

      
        var decoded = jwt.decode(token, defaultConfig.jwtTokenSecret);
        console.log(decoded.iss);

        ValidateUserCollection.findOne({_id : ObjectId(decoded.iss) },function(err,result){
        if(err)
        {
          res.status(500);
          res.json({
            "StatusCode": 500,
            "Message": "Internal Server error",
            "error": err
          });
        }
        else
        {
          if(result != null)
          {
            var currentdate = Date.now();
            var StartDate = new Date(result.CreateDate);
            if((moment().diff(StartDate, 'hours')) > 8)
              {
                res.json({
                  "StatusCode": 400,
                  "Message": "Token Expired"
                });
                return;
              }
            next(); // To move to next middleware
          }
        } 
      }); 
     
    //}
  
  }

}
     

    