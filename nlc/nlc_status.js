#!/usr/bin/env node
//
// Watson NLCのインスタンスの状態を取得する
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//

const nlc = require("./sharedlib_nlc.js");
const cdb = require("./sharedlib_cdb.js");

// NLCのインスタンス 状態リスト
cdb.list(function(err, body) {
    if (err) throw err;
    body.rows.forEach(function(doc) {
	cdb.get(doc.key, function(err,data) {
            if (err) throw err;
	    nlc.status(data, function(err,response) {
		if (!err) {
		    console.log(JSON.stringify(response, null, 2));
		}
	    });
	});
    })
});


