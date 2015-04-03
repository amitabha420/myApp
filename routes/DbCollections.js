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
                        "SubscribedUsers" : 
                                            [
                                               {
                                                  "Uid" : String
                                               }
                                            ],
				 		"GeoFencingData" : 
                                            [
                                                {
                                                    "Loc" : { "Type" : String , "Coordinates" : []  },
                                                    "Digitalcontents" : [],
                                                    "LocationName" : String
                                                }
                                            ]
    				}
    			]
},{ collection: 'AdminUsers' });

exports.AdminUsersSchema = mongoose.model('AdminUsers', AdminUsersSchema);