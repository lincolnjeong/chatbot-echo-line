//
//  watsonNLC
//    Author: Maho Takara
//

const cloudant = require("./sharedlib_cloudant.js");
const nlc = require("./nlc/sharedlib_nlc.js");

exports.messageClassifier = function(session, callback) {
    params = {
	text: session.inputMsg,
	classifier_id: "67a480x203-nlc-21924"
    }
    nlc.classify( params, function(err, resp) {
	if (err) {
	    console.log(err);
	    session.outputMsg = "内部エラー発生";
	} else {
	    console.log(JSON.stringify(resp, null, 2));
	    session.outputMsg = resp.classes[0].class_name;
	    session.confidence = parseInt(resp.classes[0].confidence * 100);
	    session.outputMsg = session.outputMsg + " 確信度=" + session.confidence + "％"
	}
	callback(err,session);
    });
}


exports.messageReply = function(session, callback) {
    params = {
	text: session.inputMsg,
	classifier_id: "67a480x203-nlc-21924"
    }
    nlc.classify( params, function(err, resp) {
	if (err) {
	    console.log(err);
	    session.outputMsg = "内部エラー発生";
	    callback(err,session);
	} else {
	    console.log(JSON.stringify(resp, null, 2));
	    session.outputMsg = "分類結果:" + resp.classes[0].class_name;
	    session.confidence = parseInt(resp.classes[0].confidence * 100);
	    session.outputMsg = session.outputMsg + " 確信度=" + session.confidence + "％"
	    getReplyMsg(resp.classes[0].class_name, function(err,rsp) {
		session.outputMsg = session.outputMsg + " 応答:" + rsp;
		callback(null,session);
	    });
	}

    });
}

function getReplyMsg(className, callback) {
    var cdb = cloudant.db.use("reply");
    query = {
	"selector": {
            "class_name": className
	},
	"fields": [
            "_id",
            "class_name",
	    "reply_message"
	]
    }
    console.log("search: ", className);

    cdb.find(query,function(err, body) {
	if (err) console.log(err);
	console.log("Hits:",body.docs.length);

	if (body.docs.length > 0) {
	    callback(null, body.docs[0].reply_message);
	}
    });

}
