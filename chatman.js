#!/usr/bin/env node
//
//  Smaple code 
//    Author: Maho Takara
//
var LineMsgApi = require('line-msg-api');
var cnf = require('./credentials.json');

cnf.port = process.env.PORT || cnf.port;  // 要再考
console.log("Listening on port ", cnf.port);
var bot = new LineMsgApi(cnf);
var sc = require("./sessionCtrl.js");

// LINEメッセージ受信
bot.on(function (message) {
    userId = message.events[0].source.userId;
    agent = "LINE"
    sc.sessionCtrl( agent, userId, message, function(err, session) {
	if (err) {
	    errorHandler(agent,message, "内部エラー", err);
	} else {
	    eventHandler(message, session, function(err,session) {});
	}
    });
});

// イベント処理 共通
function eventHandler(message, session, callback) {
    if (session.agent == "LINE") {
	_eventHandlerLine( message, session, function(err,session) {
	    callback(err,session);
	});
    } 
}

// エラー処理 共通
function errorHandler(agent, message, errorMessage, err) {
    console.log("errorHandler message = ", errorMessage, err.message);
    if (agent == "LINE") {
	bot.replyMessage(message.events[0].replyToken, errorMessage); 
    } 
}

// LINE イベント処理
function _eventHandlerLine( message, session, callback) {
    if (message.events[0].message.type == 'text') {
	session.inputMsg = message.events[0].message.text;
	// エコーバック
	bot.replyMessage(message.events[0].replyToken, session.inputMsg); 
	callback(null, session);
    } else if (message.events[0].message.type == 'image') {
	console.log("Image ----");
	fpath = DOWNLOAD + "/" + message.events[0].message.id + ".jpg"
	bot1.getContent(message.events[0].message.id,fpath);
	console.log("The image file is saved at ", fpath);
	callback(null,session);
    } else if (message.events[0].message.type == 'audio') {
	console.log("Sound ----");
	fpath = DOWNLOAD + "/" + message.events[0].message.id + ".mp4"
	bot1.getContent(message.events[0].message.id,fpath);
	console.log("The sound file is saved at ", fpath);
	callback(null,session);
    } else if (message.events[0].message.type == 'sticker') {
	console.log("Sticker ----");
	console.log(message.events[0].message);
	// ステッカーを返す
	MessageObj = {
	    "type": "sticker",
	    "packageId": "1",
	    "stickerId": "3"
	};
	bot.replyMessageObject(message.events[0].replyToken, MessageObj);
	callback(null,session);
    } else {
	console.log("Other ----");
	console.log(message.events[0]);
	callback(null,session);
    }
}
