#!/usr/bin/env node
//
//  Smaple code 
//    Author: Maho Takara
//

var LineMsgApi = require('line-msg-api');
var cnf = require('./credential.json');
var portno = process.env.PORT || cnf.server.port;
console.log("Listening on port ", portno);

var bot = new LineMsgApi(cnf);

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
