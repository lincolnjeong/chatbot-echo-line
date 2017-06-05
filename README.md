# オウム返しするチャットボット LINE版 セッション管理追加

LINEアプリから送信されたメッセージをオウム返しするもので、チャットボット開発のベースとして作りました。
複数のユーザーと同時並行に対話するために、セッション管理を実装したもので、セッション管理のために Cloudant を利用しています。


## Bluemix CFアプリとしてデプロイする場合
パソコンなど作業用の環境で以下のコマンドでファイルをダウンロードします。

~~~
git clone -b multi https://github.com/takara9/chatbot-echo-line
~~~
### LINE認証情報の設定
* credential.json.sample を credential.json にリネームします。
* LINE BUSINESS CENTER から accessToken, channelSecret を取得して credential.json に設定します。参考資料(1)
* HTTPSの暗号化通信は、 Bluemix のプラットフォームが変換するので credential.json から、これに関する部分を削除します。

~~~
{
    "accessToken": "put here your access token",
    "channelSecret": "put here your channel secret"
}
~~~
### クラウダントの準備
Bluemix のカタログから Cloudant Liteプランを選択して、Cloudant のサービスを開始します。 そしてサービス名をmanifest.ymlのservices の下の行に設定します。

~~~
applications:
- path: .
  memory: 128M
  instances: 1
  domain: mybluemix.net
  name: line-chatbot
  host: line-chatbot
  disk_quota: 1024M
  services:
   - Cloudant NoSQL DB-f1
~~~


### アプリの登録と実行
* Bluemix CLI コマンドをインストールして、Bluemix にログインします。 参考資料(2)
* 以下のコマンドを使って、CFアプリとしてデプロイします。 このコマンドは manifest.yml を読み込んでデプロイを実行するのですが、host が同一ドメインに既に存在すると失敗します。その場合は manifest.yml を編集して再実行します。

~~~
bx cf push
~~~

* コマンドが完了したら、Bluemix ポータルのダッシュボードのアプリ名 line-chatbot に、URLが表示されています。このアプリのURLをLINE developer の Message API の Webhook URLに設定して、Verify を実行して Success と表示されれば、準備完了です。
* LINEアプリからチャットボットへメッセージして、同じメッセージが受信できれば完了です。



## Bluemix Infrastructure の仮想サーバーにデプロイする場合

### 仮想サーバー開発環境の起動と git clone
* Bluemix Infrastructure の仮想サーバーを最小条件で起動します。(CPUコア:1, RAM: 1GB, NIC: 100Mbps, Disk: local 25GB) 参考資料(3)
* サーバーに次のコマンドでダウンロードします。

~~~
git clone -b multi https://github.com/takara9/chatbot-echo-line
~~~

### 暗号化通信設定とLINE認証情報のセット

* この仮想サーバーは、HTTPSの暗号化 をサーバーのアプリに実装する必要があります。デジタル証明書取得のために、仮想サーバーのIPアドレスをドメイン名で参照できる様にします。参考資料(4)
* HTTPS 通信のためのデジタル証明書を取得して、下記の key と cert にPEM形式のファイル名を設定します。 参考資料(5)
* LINE の accessToken, channelSecret を取得して、credential.json の下記に部分に設定します。

~~~
{
    "accessToken": "put here your access token",
    "channelSecret": "put here your channel secret",
    "port": 3000, 
    "https": {
        "key":  "lets_encript.key",
        "cert": "lets_encript_fullchain.crt"
    }
}
~~~

### アプリケーションに必要なモジュールのインストール
* 必要なファイルをインストールします。

~~~
npm install
~~~


### Cloudantサービス資格情報の設定
Bluemix のカタログから Cloudant Liteプランを選択して、Cloudant のサービスを開始します。ポータルの Cloudant サービス資格情報をコピペして、下記の vcap-local.json の credentials 項目をセットします。

~~~
{
    "services": {
        "cloudantNoSQLDB": [
            {
                "credentials": {
		    "username": "",
		    "password": "",
		    "host": "",
		    "port": 443,
		    "url": ""
                },
                "label": "cloudantNoSQLDB"
            }
        ]
    }
}
~~~


### アプリのスタート
* npm コマンドでアプリをスタートさせます。

~~~
npm start
~~~

* LINE developer の Message API の Webhook URLに、仮想サーバーのドメイン名で https://ドメイン名:3000/webhock 登録して接続の確認を行います。Success と表示されれば、準備完了です。
* LINEアプリからチャットボットへメッセージして、同じメッセージが受信できれば完了です。



## 参考資料
- (1) LINE BOTの作り方を世界一わかりやすく解説（１）【アカウント準備編】http://qiita.com/yoshizaki_kkgk/items/bd4277d3943200beab26
- (2) Bluemix CLIホーム https://clis.ng.bluemix.net/ui/home.html
- (3) CHANGE MAKERS 1.2 仮想サーバーを起動するには？ https://www.change-makers.jp/docs/softlayer-config-guide/10292
- (4) 私的MyDNS.JP https://www.mydns.jp/
- (5) Let's Encrypt 総合ポータル https://letsencrypt.jp/
- (6) line-msg-api https://www.npmjs.com/package/line-msg-api

