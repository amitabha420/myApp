
var express = require('express'),
    Register = require('./routes/Register');
    AdminUsers = require('./routes/AdminUsers');
    Channels = require('./routes/Channels');
 //wineM = require('./routes/WineMongoos');
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 

app.get('/Register', Register.Test);
app.post('/Register', Register.Register);
app.use('/Loggin',Register.Loggin);

app.post('/CreateAdminUsers',AdminUsers.Create);

app.post('/CreateChannel',Channels.Create);
app.post('/EditChannel',Channels.Edit);
app.post('/DeleteChannel',Channels.Delete);
app.post('/SetDigitalcontents',Channels.UploadDigitalContent);

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