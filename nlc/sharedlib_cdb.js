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


const appEnv = require("./sharedlib_vcap.js");

// クラウダントへの接続とDB作成
var cdb;
if (appEnv.services['cloudantNoSQLDB']) {
    var Cloudant = require('cloudant');
    var cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
    var dbName = 'nlcid';
    cdb = cloudant.db.use(dbName);    
    cloudant.db.create(dbName, function(err, data) {
	if(!err) 
	    console.log("Created database: " + dbName);
    });
    cdb = cloudant.db.use(dbName);    
}

module.exports = cdb;
