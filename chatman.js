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
var uuid = require('uuid');
var dbSession;
if (appEnv.services['cloudantNoSQLDB']) {
    var Cloudant = require('cloudant');
    var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
    var dbName = 'session';
    cloudant.db.create(dbName, function(err, data) {
	if(!err) 
	    console.log("Created database: " + dbName);
    });
    dbSession = cloudant.db.use(dbName);    
}


// 放置されたセッションを削除する
const SessionTimeOut  = 5*60; // 秒
const PruningInterval = 60;   // 秒
var timer = setTimeout( function() {
    date = new Date();
    sessionPruning(date.getTime() - 1000 * SessionTimeOut);
}, 1000 * PruningInterval);



// メッセージ受信
bot.on(function (message) {
    userId = message.events[0].source.userId;
    agent = "LINE"
    sessionCtrl( agent, userId, message, function(err, session) {
	if (err) {
	    errorHandler(agent,message, "内部エラー", err);
	}
    });
});



/*
  セッション管理
　　複数の端末と同時並行で処理する
*/
function sessionCtrl(agent, userId, message, callback) {
    // ユーザーIDでセッションの存在をチェック
    dbSession.get(userId, function(err,session) {
	if (err) {
	    if (err.error == 'not_found') {
		// セッション開始
		sessionOpen(agent, userId, message, function(err, session) {
		    if (err) {
			callback(err, session);
		    } else {
			_sessionCtrl(session, message, function(err, session) {
			    callback(err, session);
			});
		    }
		});
	    } else {
		callback(err,session);
	    }
	} else {
	    // セッション更新
	    _sessionCtrl(session, message, function(err, session) {
		callback(err, session);
	    });
	}
    });
}


// イベント処理の呼び出し
function _sessionCtrl(session, message, callback) {

    time = null;
    session.count = session.count + 1;
    session.last_time = time;

    eventHandler(message, session, function(err,session) {
	if (err) {
	    callback(err, session);
	} else {
	    sessionUpdate(session, function(err,session) {
		callback(err,session);
	    });
	}
    });			
}

// セッションの刈り取り
var sessionPruning = function(timeout) {
    query = {
	"selector": {
	    "last_unixTime": {
		"$lt": timeout
	    }
	},
	"fields": [
	    "_id",
	    "_rev",
	    "session_id",
	    "user_id",
	    "last_unixTime"
	]
    }

    dbSession.find(query,function(err, body) {
	if (err) {
	    throw err;
	}
	console.log("Hits:",body.docs.length);
	for (var i = 0; i < body.docs.length; i++) {
	    dbSession.destroy(body.docs[i]._id, body.docs[i]._rev);
	}

	date = new Date();
	var timer = setTimeout( function() {
	    sessionPruning(date.getTime() - 1000*SessionTimeOut);
	},1000 * PruningInterval);
    });

};


// 新規セッションの作成
function sessionOpen(agent, userId, message, callback) {

    var date;
    var reply;

    console.log("セッション OPEN");

    if (agent == "LINE"){
	date = new Date(message.events[0].timestamp);
	reply = message.events[0].replyToken
    } else {
	date = new Date(message.getTime());
	reply = message.getSenderId();
    }
    var time = date.toLocaleString();

    // セッションDOC 作成
    var doc = {
	session_id: uuid.v4(),
	user_id: userId,
	agent: agent,
	profile: {},
	context: {},
	count: 0,
	reply_id: reply,
	start_time: time,
	last_time: time,
	start_unixTime: date.getTime(),
	last_unixTime: date.getTime()
    };

    // セッション登録
    dbSession.insert(doc, userId, function(err,res) {
	// 要注意
	doc._id = res.id;
	doc._rev = res.rev;
	callback(err,doc);
    });
    
}

// セッション更新
function sessionUpdate(session, callback) {
    console.log("セッション UPDATE");
    session.last_unixTime = date.getTime();
    dbSession.insert(session,session.user_id, function(err, res) {
	callback(err,res);
    });
}

// セッション終了
function sessionClose(session, callback) {
    console.log("セッション CLOSE");
    dbSession.get(session.user_id, function(err,session) {
	if (err) {
	    callback(err,session);
	} else {
	    dbSession.destroy(session.user_id, session._rev, function(err, body, header) {
		callback(err,body);
	    });
	}
    });
}

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
