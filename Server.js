


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

 
app.get('/Register', Register.Test);
app.post('/Register', Register.Register);
app.post('/updateRegistration',Register.updateRegistration);
app.post('/Loggin',Register.Loggin);
app.post('/User/getUserDetails',Register.getUserDetails);
app.post('/User/ChangePassword',Register.changePassword);
app.post('/User/FeedBack',UserFeedBack.Create);
app.post('/User/getHistory',UserContentAccessHistory.getHistory);
app.post('/User/clearHistory',UserContentAccessHistory.clearHistory);


app.post('/DigitalContents/GetLocationContents',LocationSearch.GetContentsOfSpecificLocation);
app.post('/DigitalContents/GeoLocations', LocationSearch.GeoLocations);
app.post('/DigitalContents/GetContents',LocationSearch.GetContents);


app.post('/User/SaveContent',SaveChannelContents.SAVEChannelContent4User);
app.post('/User/GetContent',SaveChannelContents.GetChannelContent4User);
app.post('/User/ClearSavedSyncSpots',SaveChannelContents.ClearChannelContent4User);


app.post('/Statistics/WriteAccess',Statistics.EnlistContentAccess);
app.post('/Statistics/GetContentAccessFrequencyByeDays', Statistics.GetContentAccessFrequencyByeDays);
app.post('/Statistics/GetUserContentAccessFrequencyDetails', Statistics.GetUserContentAccessFrequencyDetails);

app.post('/Statistics/SetUserInSyncSpot', Statistics.SetUserInSyncSpot);
app.post('/Statistics/SetUserOutSyncSpot',Statistics.SetUserOutSyncSpot);
app.post('/Statistics/GetSyncSpotStatisticsBetweenDate',Statistics.GetSyncSpotStatisticsBetweenDate);

//app.get('/Statistics/callstoredFunction', Statistics.callstoredFunction);
app.post('/Statistics/lockContent', Statistics.lockContent);
app.post('/Policy',Policy.getTerms_and_Conditions);




//A token is valid is upto 8 hours
app.all('/syncspot/cloud/api/v1/webcms/*', [require('./middlewares/validateAdminRequest')]);
/*WebCMS API*/
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