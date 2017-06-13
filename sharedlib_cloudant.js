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
var cloudant;
if (appEnv.services['cloudantNoSQLDB']) {
    var Cloudant = require('cloudant');
    cloudant = Cloudant(appEnv.services['cloudantNoSQLDB'][0].credentials);
}
module.exports = cloudant;


