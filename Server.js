
var express = require('express'),
    Register = require('./routes/Register');
    Channel = require('./routes/Channel');
 //wineM = require('./routes/WineMongoos');
var app = express();
 
app.configure(function () {
    app.use(express.logger('dev'));     /* 'default', 'short', 'tiny', 'dev' */
    app.use(express.bodyParser());
});
 

app.get('/Register', Register.Test);
app.post('/Register', Register.Register);
app.use('/Loggin',Register.Loggin);

app.post('/CreateChannel',Channel.Create);
app.post('/EditChannel',Channel.Edit);

//app.get('/wines', wine.findAll);
//app.get('/wines/:id', wine.findById);
//app.post('/wines', wine.addWine);
//app.put('/wines/:id', wine.updateWine);
//app.delete('/wines/:id', wine.deleteWine);
 

app.listen(3000);
//app.listen(process.env.PORT || 81);
console.log('Listening on port 3000...');

/*
var http = require('http');
http.createServer(function (req, res) {
  res.writeHead(200, {'Content-Type': 'text/plain'});
  res.end('Hello World\n');
}).listen(3000, '127.0.0.1');
console.log('Server running at http://127.0.0.1:3000/');
*/