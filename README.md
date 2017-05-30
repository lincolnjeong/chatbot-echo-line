# chatbot-echo-line
Chatbot node.js template for LINE Message API   echo-back

# チャットボットのテンプレート LINE メッセージAPI

LINE メッセージAPIに接続して、メッセージをエコーするもので、
チャットボット開発のテンプレートにする事ができます。


# 使い方

## 仮想サーバーにデプロイする場合

下記のファイルの４箇所を修正します。
accessToken, channelSecret は、LINE BUSINESS CENTER https://business.line.me/ja/ Messaging API から取得します。
暗号化通信するためのデジタル証明書とキーは、無料で取得できる Let's Encrypt (https://letsencrypt.jp/) も利用できます。 
デジタル証明書を取得する前に、ドメイン名を取得しておく必要があります。このドメイン名を無料で取得するには、MyDNS.JP https://www.mydns.jp/ があります。

~~~file:echoback_bot.js
var bot = new LineMsgApi({
    accessToken: 'Put here your access token',
    channelSecret: 'Put here your channel secret',
    server: {
        port: portno,
	key:  'Put here the file name of encript.key',
	cert: 'Put here the file name of encript_fullchain.crt'
    }
});
~~~

証明書とキーは、PEM形式のファイルで提供されますから、key と cert にセットするには、以下の様に書くと良いでしょう。

~~~
 "key":  "lets_encript.key",
 "cert": "lets_encript_fullchain.crt"
~~~

必要なファイルをインストールします。

~~~
npm install
~~~

次にアプリをスタートさせます。

~~~
npm start
~~~

LINE developer の Message API の Webhook URLに、仮想サーバーのドメイン名で https://ドメイン名:3000/webhock 登録して接続の確認を行います。
Success と表示されれば、準備完了です。



## Bluemix CFアプリにデプロイする場合

LINE BUSINESS CENTER から accessToken, channelSecret を取得するところは同じです。
Bluemix で動作させる場合、HTTPSの暗号化通信は、Bluemix のドメインを使って実施できますから、これに関する部分を削除します。

~~~file:echoback_bot.js
var bot = new LineMsgApi({
    accessToken: 'Put here your access token',
    channelSecret: 'Put here your channel secret',
    server: {
        port: portno
    }
});
~~~

次に、Bluemix CLI コマンドをインストールしておき、ログイン後に、以下のコマンドで、CFアプリとして稼働させます。

~~~
bx cf push
~~~

コマンドが完了したら、Bluemix ポータルのダッシュボードのアプリ名 line-chatbot に、URLが表示されています。
このURLをLINE developer の Message API の Webhook URLに、仮想サーバーのドメイン名で https://[BluemixのURL]/webhock 登録して接続の確認を行います。
Success と表示されれば、準備完了です。




