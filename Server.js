


var express = require('express');
    bodyParser = require('body-parser');
    Register = require('./routes/Register');
    UserFeedBack = require('./routes/UserFeedBack');
    Channels = require('./routes/Channels');
    LocationSearch = require('./routes/LocationSearch');
    SaveChannelContents = require('./routes/SaveChannelContents');
    Statistics = require('./routes/Statistics');
    UserContentAccessHistory = require('./routes/UserContentAccessHistory');
    LocationType = require('./routes/LocationTypes');
    WebCMS = require('./routes/WebCMS');
    Policy = require('./routes/Policy');
var app = express();


app.use(bodyParser.json({limit: '10mb'}))
   .use(bodyParser.urlencoded({limit: '10mb', extended: true}));

 

/*static elements*/
app.use('/gcloud/syncspot/static/img',express.static("static" + "/img"));

/*end static elements*/



//*Mobile App API*//
//Api Key is valid for life time, no expires time
app.all('/syncspot/cloud/api/v1/app/*', [require('./middlewares/validateUserRequest')]);
 
app.get('/Register', Register.Test);
app.post('/syncspot/cloud/api/v1/app/Register', Register.Register);
app.post('/syncspot/cloud/api/v1/app/updateRegistration',Register.updateRegistration);
app.post('/syncspot/cloud/api/v1/app/updateRegistrationWithPassword',Register.updateRegistrationWithPassword);
app.post('/syncspot/cloud/api/v1/app/Loggin',Register.Loggin);
app.post('/syncspot/cloud/api/v1/app/User/getUserDetails',Register.getUserDetails);
app.post('/syncspot/cloud/api/v1/app/User/ChangePassword',Register.changePassword);
app.post('/syncspot/cloud/api/v1/app/User/FeedBack',UserFeedBack.Create);
app.post('/syncspot/cloud/api/v1/app/User/getHistory',UserContentAccessHistory.getHistory);
app.post('/syncspot/cloud/api/v1/app/User/clearHistory',UserContentAccessHistory.clearHistory);


app.post('/syncspot/cloud/api/v1/app/DigitalContents/GetLocationContents',LocationSearch.GetContentsOfSpecificLocation);
app.post('/syncspot/cloud/api/v1/app/DigitalContents/GeoLocations', LocationSearch.GeoLocations);
app.post('/syncspot/cloud/api/v1/app/DigitalContents/GetContents',LocationSearch.GetContents);


app.post('/syncspot/cloud/api/v1/app/User/SaveContent',SaveChannelContents.SAVEChannelContent4User);
app.post('/syncspot/cloud/api/v1/app/User/GetContent',SaveChannelContents.GetChannelContent4User);
app.post('/syncspot/cloud/api/v1/app/User/ClearSavedSyncSpots',SaveChannelContents.ClearChannelContent4User);


app.post('/syncspot/cloud/api/v1/app/Statistics/WriteAccess',Statistics.EnlistContentAccess);
app.post('/syncspot/cloud/api/v1/app/Statistics/GetContentAccessFrequencyByeDays', Statistics.GetContentAccessFrequencyByeDays);
app.post('/syncspot/cloud/api/v1/app/Statistics/GetUserContentAccessFrequencyDetails', Statistics.GetUserContentAccessFrequencyDetails);

app.post('/syncspot/cloud/api/v1/app/Statistics/SetUserInSyncSpot', Statistics.SetUserInSyncSpot);
app.post('/syncspot/cloud/api/v1/app/Statistics/SetUserOutSyncSpot',Statistics.SetUserOutSyncSpot);
app.post('/syncspot/cloud/api/v1/app/Statistics/GetSyncSpotStatisticsBetweenDate',Statistics.GetSyncSpotStatisticsBetweenDate);

//app.get('/Statistics/callstoredFunction', Statistics.callstoredFunction);
app.post('/syncspot/cloud/api/v1/app/Statistics/lockContent', Statistics.lockContent);
app.post('/syncspot/cloud/api/v1/app/Policy',Policy.getTerms_and_Conditions);



/*WebCMS API*/
//A token is valid is upto 8 hours
app.all('/syncspot/cloud/api/v1/webcms/*', [require('./middlewares/validateAdminRequest')]);

app.post('/syncspot/cloud/api/v1/webcms/CreateAdminUsers',WebCMS.CreateAdminUsres);
app.post('/syncspot/cloud/api/v1/webcms/UpdateAdminUsres',WebCMS.UpdateAdminUsres);
app.post('/syncspot/cloud/api/v1/webcms/GetChannelAdminByID',WebCMS.GetChannelAdminByID);
app.post('/syncspot/cloud/api/v1/webcms/DeleteChannelAdminbyID',WebCMS.DeleteChannelAdminbyID);

app.post('/syncspot/cloud/api/v1/webcms/adminLoggin',WebCMS._Login); //admin and super admin login is integrated 

app.post('/syncspot/cloud/api/v1/webcms/getAdmins',WebCMS.getAdminsData);
app.post('/syncspot/cloud/api/v1/webcms/getChannels',WebCMS.getChannels4Admin);
app.post('/syncspot/cloud/api/v1/webcms/getLocations_type1',WebCMS.GetLocationsOfChannel_v1)
app.post('/syncspot/cloud/api/v1/webcms/getLocations_type2',WebCMS.GetLocationsOfChannel_v2)
app.post('/syncspot/cloud/api/v1/webcms/getLocationDetailsByLocationId',WebCMS.getLocationDetailsByLocationId);

//app.post('/syncspot/cloud/api/v1/webcms/GetChannels',Channels.GetChannels);
app.post('/syncspot/cloud/api/v1/webcms/CreateChannel',Channels.Create);
app.post('/syncspot/cloud/api/v1/webcms/EditChannel',Channels.Edit);
app.post('/syncspot/cloud/api/v1/webcms/DeleteChannel',Channels.Delete);
app.post('/syncspot/cloud/api/v1/webcms/GetChannelById',Channels.GetChannelById);
app.post('/syncspot/cloud/api/v1/webcms/DeleteGeoFenceDataForChannel',Channels.DeleteGeoFenceDataForChannel);  //not mensioned by client
app.post('/syncspot/cloud/api/v1/webcms/CreateGeoLocation',Channels.CreateGeoLocation);
app.post('/syncspot/cloud/api/v1/webcms/AlterDigitalcontents',Channels.EditDigitalContents);
app.post('/syncspot/cloud/api/v1/webcms/addContentToChannel',Channels.addContentToChannel);  //not mensioned by client 
app.post('/syncspot/cloud/api/v1/webcms/getContentByLocationId', WebCMS.getContentByLocationId);
app.post('/syncspot/cloud/api/v1/webcms/removeContentByContentId', WebCMS.removeContentByContentId);

app.post('/syncspot/cloud/api/v1/webcms/DigitalContents/GetLocationContents',LocationSearch.GetContentsOfSpecificLocation);
app.post('/syncspot/cloud/api/v1/webcms/Statistics/GetContentsStatinDateRange',WebCMS.GetContentWiseStats_v1);

app.post('/syncspot/cloud/api/v1/webcms/LocationTypes/Create',LocationType.CreateLocationType);
app.post('/syncspot/cloud/api/v1/webcms/LocationTypes/Get', LocationType.getLocationType);
app.post('/syncspot/cloud/api/v1/webcms/LocationTypes/remove', LocationType.removeLocationTypeById);
 
app.post('/syncspot/cloud/api/v1/webcms/Statistics/getNewUserCount_Weekly_Monthly_Daily', Statistics.getNewUserCount_Weekly_Monthly_Daily);
app.post('/syncspot/cloud/api/v1/webcms/Statistics/getContentAccessCount_Weekly_Monthly_Daily',Statistics.getContentAccessCount_Weekly_Monthly_Daily);

//app.post('/syncspot/cloud/api/v1/webcms/getUserCountBeforeLastWeek', WebCMS.getUserCountBeforeLastWeek);

app.post('/syncspot/cloud/api/v1/webcms/DeleteGeoLocationByLocationId',Channels.DeleteGeoLocationByLocationId); 
// more middleware (executes after routes)
app.use(function(req, res, next) {
  //console.log('middleware');
});


// error handling middleware
app.use(function(err, req, res, next) {

  if(err)
  {

    //console.log(req.body);
    
    //
    // Do not change the code. loggin is done.
    //
    var LogEntryModel = require('./routes/DbCollections.js').LogEntryModel;

    var LogEntryStream = require('bunyan-mongodb-stream')({model: LogEntryModel});

    var bunyan = require('bunyan');
    var logger = bunyan.createLogger({
    name: 'SyncSpot-bunyan',
    req : req,
    reqbody : req.body,
    streams: [
        {
            stream: LogEntryStream
        }
      ],
      serializers: bunyan.stdSerializers
    });
    logger.info(err);
    res.status(500).send({"StatusCode" : "500" ,"Message" : err.message});
  }
  
  /*
  res.render('error', {
        message: err.message,
        error: err
    });*/
});


app.listen(3000);
console.log('Listening on port 3000...');

/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
*/