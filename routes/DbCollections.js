var mongoose = require('mongoose');
//mongoose.connect('mongodb://localhost/SyncSpot');

//exports.mongoose = mongoose.connect('mongodb://localhost/SyncSpot');
exports.mongoose = mongoose.connect('mongodb://localhost/NewSyncSpot');

var Schema = mongoose.Schema;
ObjectId = Schema.ObjectId;

var ValidateUser = new Schema({
    "UserId" : String,//{ type: Schema.ObjectId, auto: true },
    "CreateDate" : {type: Date, default: Date.now}
},{collection : 'ValidateUser'});

exports.ValidateUserCollection = mongoose.model('ValidateUser', ValidateUser);

var UsersSchema = new Schema({
    "firstName" : String,
    "lastName" : String,
 	"email": String,
 	"password" : String,
    "gender": String,
    "age": String,
    "profiletype": String,  //values => facebook/twitter/manual(default)
    "token" : String,
    "profileimageurl" : String,
    "CreateDate" : {type: Date, default: Date.now}
},{ collection: 'Users' });

exports.UsersCollection = mongoose.model('Users', UsersSchema);


var AdminUsersSchema = new Schema({
 	"User": String,
    "password": String,
    "IsSuperAdmin" : Boolean,
    "IsApp" :Boolean,
    "AppName" : String,
    "firstName" : String,
    "lastName" : String,
    "address" : String,
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
    "ChannelDescription" : String,
    "BannerImageUrl" : String,
    "LocationType":String,
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
                                MaxAccessValue : String,
                                Downloadable : { type: Boolean, default: false }
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
    channelid : String,
    contentImageUrl :String,
    locationid : String,
    contenturl : String,
    contentName : String,
    contentid : String,
    deleted : Boolean,
    CreateDate : {type: Date, default: Date.now},
    IsDownloaded : {type: Boolean,default:false}
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


//feed back db
var FeedBackSchema = new Schema({
    topic : String,
    message : String,
    userid:String,
    CreateDate : {type: Date, default: Date.now}
},{collection : 'FeedBack'});
exports.FeedBackSchema = mongoose.model('FeedBack', FeedBackSchema);

var LocationTypeSchema = new Schema({
    LocationType : String
},{collection : 'LocationType'});
exports.LocationTypeSchema = mongoose.model('LocationType', LocationTypeSchema);



var LogEntrySchema = new mongoose.Schema({
    msg: {
        type: String,
        required: true
    },
    level: {
        type: Number,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    time: {
        type: Date,
        required: true
    },
    res : {
        type: Object
    },
    req : {
        type: Object
    },
    reqbody : {
        type : Object
    }
},{collection : 'Log'});

exports.LogEntryModel = mongoose.model('Log', LogEntrySchema);


