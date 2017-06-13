#!/usr/bin/env node
//
// Watson NLCのインスタンスを作成する
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
// 2017/6/13  更新  VCAP対応とNLCのIDを登録
//

var fs = require('fs');
const nlc = require("./sharedlib_nlc.js");
const cdb = require("./sharedlib_cdb.js");

if (process.argv.length != 5) {
    console.log("Usage ./nlc_create.js language name filename");
    console.log("example  ./nlc_create.js ja greetings ./greetings.csv"); 
    process.exit();
}

// Create NLC Classifier
var params = {
    language: process.argv[2],
    name: process.argv[3],
    training_data: fs.createReadStream(process.argv[4])
};

nlc.create(params, function(err, resp) {
    if (err) {
	throw err;
    } else {
	cdb.insert( resp, resp.classifier_id, function(err) {
	    if (err) throw err;
	    console.log('NLC 登録完了', JSON.stringify(resp,null,'  '));
	});
    }
});

