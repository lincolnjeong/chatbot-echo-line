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

const appEnv = require("../sharedlib_vcap.js");

// Watson NLC への接続 と NLC作成
var nlc;
if (appEnv.services['natural_language_classifier']) {
    var Watson = require('watson-developer-cloud');
    nlc = Watson.natural_language_classifier(appEnv.services['natural_language_classifier'][0].credentials);
}

module.exports = nlc;
