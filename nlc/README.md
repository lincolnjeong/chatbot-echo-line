# Watson NLCトレーニング用 データとツール

Watson NLC API を利用したツールで、ファイル名と役割のリストです。

* README.md         このファイル
* greetings.csv     訓練データ
* nlc_create.js     分類器の作成とトレーニング
* nlc_delete.js     削除
* nlc_list.js       一覧作成
* nlc_status.js     各分類器の状態リスト
* nlc_test.js       分類テスト
* package.json      npmパッケージ
* sharedlib_cdb.js　CloudantDBへの接続共通部
* sharedlib_nlc.js　WatsonNLCへの接続共通部
* sharedlib_vcap.js VCAP環境取得用共通部


## 分類器の作成とトレーニング

~~~

~~~


~~~
./nlc_create.js ja greetings greetings.csv
~~~
