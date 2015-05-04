var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/SyncSpot');

//exports.mongoose = mongoose.connect('mongodb://localhost/SyncSpot');
exports.mongoose = mongoose.connect('mongodb://localhost/NewSyncSpot');

var Schema = mongoose.Schema;

var UsersSchema = new Schema({
    "firstName" : String,
    "lastName" : String,
 	"email": String,
 	"password" : String,
    "gender": String,
    "age": String,
    "profiletype": String,  //values => facebook/twitter/manual(default)
    "token" : String,
    "profileimageurl" : String
},{ collection: 'Users' });

exports.UsersCollection = mongoose.model('Users', UsersSchema);


var AdminUsersSchema = new Schema({
 	"User": String,
    "password": String,
    "IsSuperAdmin" : Boolean,
    "IsApp" :Boolean,
    "AppName" : String,
    "Channel" : 
    			[
    				{
    					"ChannelName" : String,
    					"ChannelDescription" : String,
                        "BannerImageUrl" : String,
                        "CreateDate" : {type: Date, default: Date.now},
                        "ModifiedDate" : {type : Date, default : Date.now}     
                        
    				}
    			]
},{ collection: 'AdminUsers' });
//AdminUsersSchema.index({ "Channel.GeoFencingData.Loc" : '2dsphere'});
exports.AdminUsersSchema = mongoose.model('AdminUsers', AdminUsersSchema);


/*New Schema containing the geolocations*/
var GeoLocationSchema = new Schema({
    "UserId" : String,
    "ChannelId" : String,
    "ChannelName" : String,
    "BannerImageUrl" : String,
    "loc" : { type : {type: String }, coordinates : []  },
    "Matchpoint" : {type : {type : String}, coordinates : []},
    "Digitalcontents" : [
                            {
                                Url : String,
                                Name : String,
                                Type : String,
                                ImageUrl : String,
                                StartingTime : String,
                                EndingTime : String,
                                MaxAccessValue : String
                            }
                        ],
    "LocationName" : String,
    "Notification" : String,
    "SubscribedUsers" : []
},{collection: 'GeoLocations' });
GeoLocationSchema.index({ "loc" : '2dsphere'});
exports.GeoLocationSchema = mongoose.model('GeoLocations', GeoLocationSchema);





//UserSavedContents collection for user/SaveContent and user/getContent API
var UserSavedContentsSchema = new Schema({
    userid : String,
    locationid : String,
    locationName : String,
    lat : String,
    lng : String,
    contenturl :  String,
    EndingTime : String,
    StartingTime : String,
    ImageUrl : String,
    Type : String,
    Name :String
},{ collection : 'UserSavedContents'});
exports.UserSavedContentsSchema = mongoose.model('UserSavedContents',UserSavedContentsSchema);


//StatContentAccess collection, Here we are saving the contents access statistics by user
var StatContentAccessSchema = new Schema({
    userid : String,
    channeladminid :String,
    locationid : String,
    contenturl : String,
    contentName : String,
    contentid : String,
    CreateDate : {type: Date, default: Date.now}
},{collection : 'StatContentAccess'});

exports.StatContentAccessSchema = mongoose.model('StatContentAccess', StatContentAccessSchema);

//StatSyncSpot collection, here we are saving the user syncspot statistics, means when a user enter in a syncspot, how many time the user is in the spot and when the user leaves from the spot
var StatSyncSpotSchema = new Schema({
    SyncSpotInTime : {type: Date, default: Date.now},
    UserId : String,
    UserName : String,
    SyncSpotId : String, //LocationId
    SyncSpotName : String, //LocationName
    ChannelId : String,
    ChannelName : String,
    SyncSpotOutTime : {type: Date}
},{collection : 'StatSyncSpot'});
exports.StatSyncSpotSchema = mongoose.model('StatSyncSpot', StatSyncSpotSchema);


