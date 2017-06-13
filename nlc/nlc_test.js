#!/usr/bin/env node
//
// Watson NLCのインスタンスをテストする
//   クラス判定するテキストは、本ファイルを編集する
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
//
// ローカルVCAP設定と資格情報の読込み

const nlc = require("./sharedlib_nlc.js");
const cdb = require("./sharedlib_cdb.js");

if (process.argv.length != 3) {
    console.log("Usage: ./nlc_test.js classifier_id");
    process.exit();
}

// テスト
var rl = require('readline');
var rli = rl.createInterface(process.stdin, process.stdout);
rli.setPrompt('NLC> ');

rli.on('line', function(input) {
    if (input == "z") {
	rli.close();
    } else {
	params = {
	    text: input,
	    classifier_id: process.argv[2]
	}
	nlc.classify( params, function(err, response) {
	    if (err) {
		console.log(err);
		rli.close();
	    } else {
		console.log(JSON.stringify(response, null, 2));
		rli.prompt();
	    }
	});
    }
}).on('close', function () {
    process.stdin.destroy();
    process.exit();
});

rli.prompt();


