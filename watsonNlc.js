//
//  watsonNLC
//    Author: Maho Takara
//

//const cloudant = require("./sharedlib_cloudant.js");
const nlc = require("./nlc/sharedlib_nlc.js");

exports.question_and_answer = function(session, callback) {
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
