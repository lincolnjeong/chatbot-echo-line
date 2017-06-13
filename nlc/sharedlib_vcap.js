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

// ローカルVCAP設定と資格情報の読込み
const cfenv = require("cfenv");
var vcapLocal;
try {
    vcapLocal = require("../vcap-local.json");
} catch (err) {
    throw err;
}
const appEnvOpts = vcapLocal ? { vcap: vcapLocal} : {}
const appEnv = cfenv.getAppEnv(appEnvOpts);

module.exports = appEnv;
