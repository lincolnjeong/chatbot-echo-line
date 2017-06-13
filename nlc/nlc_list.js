#!/usr/bin/env node
//
// Watson NLCのインスタンスをリストする
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//

const nlc = require("./sharedlib_nlc.js");

// Create NLC Classifier
var params = {
    language: 'ja',
    name: "greetings"
};

nlc.list(params, function(err,response) {
    if (err)
	console.log('error:', err);
    else
	console.log(JSON.stringify(response, null, 2));
});







