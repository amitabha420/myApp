
var express = require('express'),
    Register = require('./routes/Register');
    AdminUsers = require('./routes/AdminUsers');
    Channels = require('./routes/Channels');
    LocationSearch = require('./routes/LocationSearch');
    SaveChannelContents = require('./routes/SaveChannelContents');
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 

app.get('/Register', Register.Test);
app.post('/Register', Register.Register);
app.use('/Loggin',Register.Loggin);

app.post('/CreateAdminUsers',AdminUsers.Create);

app.post('/GetChannels',Channels.GetChannels);
app.post('/CreateChannel',Channels.Create);
app.post('/EditChannel',Channels.Edit);
app.post('/DeleteChannel',Channels.Delete);
app.post('/SetDigitalcontents',Channels.UploadDigitalContent);
app.post('/AlterDigitalcontents',Channels.EditDigitalContents);

app.post('/GetAllLocations',LocationSearch.GetAllLocations); //Not using now, Just keeping for reference
app.post('/DigitalContents/GeoLocations', LocationSearch.GeoLocations);
app.post('/DigitalContents/GetContents',LocationSearch.GetContents);


app.post('/User/SaveContent',SaveChannelContents.SAVEChannelContent4User);
app.post('/User/GetContent',SaveChannelContents.GetChannelContent4User);

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