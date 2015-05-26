
var express = require('express');
    bodyParser = require('body-parser');
    Register = require('./routes/Register');
    UserFeedBack = require('./routes/UserFeedBack');
    Channels = require('./routes/Channels');
    LocationSearch = require('./routes/LocationSearch');
    SaveChannelContents = require('./routes/SaveChannelContents');
    Statistics = require('./routes/Statistics');
    UserContentAccessHistory = require('./routes/UserContentAccessHistory');
    WebCMS = require('./routes/WebCMS');
var app = express();


app.use(bodyParser.json({limit: '10mb'}))
   .use(bodyParser.urlencoded({limit: '10mb', extended: true}));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({extended: true}));
//app.use(express.bodyParser({limit: '10mb'}));
 
 /*
app.configure(function () {
    app.use(express.logger('dev'));     // 'default', 'short', 'tiny', 'dev'
    app.use(express.bodyParser());
});*/
 

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




//app.post('/CreateAdminUsers',AdminUsers.Create);



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




//A token is valid is upto 8 hours
//app.all('/syncspot/cloud/api/v1/webcms/*', [require('./middlewares/validateAdminRequest')]);
/*WebCMS API*/
app.post('/syncspot/cloud/api/v1/webcms/CreateAdminUsers',WebCMS.CreateAdminUsres);
app.post('/syncspot/cloud/api/v1/webcms/adminLoggin',WebCMS._Login); //admin and super admin login is integrated 
//app.post('/syncspot/cloud/api/v1/webcms/adminLoggin',WebCMS.adminLoggin);
//app.post('/syncspot/cloud/api/v1/webcms/SuperAdminLoggin',WebCMS.SuperAdminLoggin);

app.post('/syncspot/cloud/api/v1/webcms/getAdmins',WebCMS.getAdminsData);
app.post('/syncspot/cloud/api/v1/webcms/getChannels',WebCMS.getChannels4Admin);
app.post('/syncspot/cloud/api/v1/webcms/getLocations_type1',WebCMS.GetLocationsOfChannel_v1)
app.post('/syncspot/cloud/api/v1/webcms/getLocations_type2',WebCMS.GetLocationsOfChannel_v2)

//app.post('/syncspot/cloud/api/v1/webcms/GetChannels',Channels.GetChannels);
app.post('/syncspot/cloud/api/v1/webcms/CreateChannel',Channels.Create);
app.post('/syncspot/cloud/api/v1/webcms/EditChannel',Channels.Edit);
app.post('/syncspot/cloud/api/v1/webcms/DeleteChannel',Channels.Delete);
app.post('/syncspot/cloud/api/v1/webcms/DeleteGeoFenceDataForChannel',Channels.DeleteGeoFenceDataForChannel);  //not mensioned by client
app.post('/syncspot/cloud/api/v1/webcms/CreateGeoLocation',Channels.CreateGeoLocation);
app.post('/syncspot/cloud/api/v1/webcms/AlterDigitalcontents',Channels.EditDigitalContents);
app.post('/syncspot/cloud/api/v1/webcms/addContentToChannel',Channels.addContentToChannel);  //not mensioned by client 

app.post('/syncspot/cloud/api/v1/webcms/DigitalContents/GetLocationContents',LocationSearch.GetContentsOfSpecificLocation);
app.post('/syncspot/cloud/api/v1/webcms/Statistics/GetContentsStatinDateRange',WebCMS.GetContentWiseStats_v1);


//app.get('/testConfig',LocationSearch.testConfig);
/*app.get('/testConfig',function(req,res)
  {
    var s = require('./defaultConfig.json');
    res.send(s.channeldefaultbanner);
    //res.send('ok');
  });*/
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