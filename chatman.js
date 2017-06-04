#!/usr/bin/env node
//
//  Smaple code 
//    Author: Maho Takara
//

var LineMsgApi = require('line-msg-api');
var cnf = require('./credentials.json');
console.log("Listening on port ", process.env.PORT || cnf.port);
var bot = new LineMsgApi(cnf);


// ローカルVCAP設定と資格情報の読込み
const cfenv = require("cfenv");
var vcapLocal;
try {
    vcapLocal = require("./vcap-local.json");
    console.log("Loaded local VCAP", vcapLocal);
} catch (err) {
    console.log(err.message);
}
const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);


// クラウダントへの接続とDB作成
if (appEnv.services['cloudantNoSQLDB']) {
  var Cloudant = require('cloudant');
  var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
  var dbName = 'sessionStore';
  cloudant.db.create(dbName, function(err, data) {
    if(!err) 
      console.log("Created database: " + dbName);
  });
    mydb = cloudant.db.use(dbName);    
}



// Geting a message
bot.on(function (msg) {

    if (msg.events[0].message.type == 'text') {
	console.log("Message ----");
	console.log( msg.events[0].message.text);
	replyMessage = msg.events[0].message.text;

	// Replying a message
	bot.replyMessage(msg.events[0].replyToken, replyMessage);

	// Getting the user profile of the message sender
	bot.getProfile(msg.events[0].source.userId ,function(err,profile) {
	    console.log("profile= ", profile);
	    
	    if ( replyMessage == 'Push') {
		// Pushing a message
		bot.pushMessage(profile.userId, "Hello Tokyo");
	    }
	});
    } else if (msg.events[0].message.type == 'image') {
	// Getting a image file
	console.log("Image ----");
	bot.getContent(msg.events[0].message.id,"test.jpg");
    } else if (msg.events[0].message.type == 'audio') {
	// Getting a sound file
	console.log("Sound ----");
	bot.getContent(msg.events[0].message.id,"test.au");
    } else if (msg.events[0].message.type == 'sticker') {
	// Getting a stikcer IDs
	console.log("Sticker ----");
	console.log(msg.events[0].message);
	MessageObj = {
	    "type": "sticker",
	    "packageId": "1",
	    "stickerId": "3"
	};
	bot.replyMessageObject(msg.events[0].replyToken, MessageObj);
    } else {
	// Getting other info
	console.log("Other ----");
	console.log(msg.events[0]);
    }
});
