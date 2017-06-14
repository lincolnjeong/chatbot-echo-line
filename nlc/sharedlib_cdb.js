#!/usr/bin/env node
//
// Cloudant と接続して、データベースを指定する
//
// 作者 Maho Takara    takara@jp.ibm.com
//
// Copyright (C) 2016 International Business Machines Corporation 
// and others. All Rights Reserved. 
// 
// 2016/8/15  初版
// 2017/6/13  更新  VCAP対応とNLCのIDを登録
//
const appEnv = require("../sharedlib_vcap.js");
const cloudant = require("../sharedlib_cloudant.js");

var dbName = 'nlcid';
cloudant.db.create(dbName, function(err, data) {
    if(!err) 
	console.log("Created database: " + dbName);
});
cdb = cloudant.db.use(dbName);    

module.exports = cdb;
