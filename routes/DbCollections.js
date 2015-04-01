var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/SyncSpot');

var Schema = mongoose.Schema;

var UsersSchema = new Schema({
 	"email": String,
 	"password" : String,
    "gender": String,
    "age": String,
    "profiletype": String,  //values => facebook/twitter/manual(default)
    "token" : String
},{ collection: 'Users' });

exports.UsersCollection = mongoose.model('Users', UsersSchema);


var ChannelSchema = new Schema({
 	"Name": String,
    "Description": String
},{ collection: 'Channels' });

exports.ChannelCollection = mongoose.model('Channels', ChannelSchema);