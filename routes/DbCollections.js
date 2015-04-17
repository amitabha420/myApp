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
                        "ModifiedDate" : {type : Date, default : Date.now},        
                        "SubscribedUsers" : 
                                            [
                                               {
                                                  "Uid" : String
                                               }
                                            ],
				 		"GeoFencingData" : 
                                            [
                                                {
                                                    "Loc" : { type : {type: String }, coordinates : []  },
                                                    "CentralCoordinate":[],
                                                    "Digitalcontents" : [],
                                                    "LocationName" : String,
                                                    "Notification" : String,
                                                }
                                            ]
    				}
    			]
},{ collection: 'AdminUsers' });

AdminUsersSchema.index({ "Channel.GeoFencingData.Loc" : '2dsphere'});
exports.AdminUsersSchema = mongoose.model('AdminUsers', AdminUsersSchema);



var UserSavedContentsSchema = new Schema({
    userid : String,
    locationid : String,
    locationName : String,
    lat : String,
    lng : String,
    contenturl :  String,
    Content : []
},{ collection : 'UserSavedContents'});
exports.UserSavedContentsSchema = mongoose.model('UserSavedContents',UserSavedContentsSchema);


var StatContentAccessSchema = new Schema({
    userid : String,
    channeladminid :String,
    locationid : String,
    contenturl : String,
    contentName : String,
    CreateDate : {type: Date, default: Date.now}
},{collection : 'StatContentAccess'});

exports.StatContentAccessSchema = mongoose.model('StatContentAccess', StatContentAccessSchema);