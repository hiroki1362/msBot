//初めてのBOT
var restify = require("restify");
var builder = require("botbuilder");
var port = process.env.PORT || 8080;
var botConnectorOptions = { 
	    appId: process.env.BOTFRAMEWORK_APPID, 
	    appSecret: process.env.BOTFRAMEWORK_APPSECRET 
	};

//BOTの作成
var bot = new builder.BotConnectorBot(botConnectorOptions);

var dialog   = new builder.CommandDialog();

//起動時のハンドリング
dialog.matches('名前おしえるね', function (session) {
if (! session.userData.firstName) {
 session.beginDialog('/profile/first');
} else if(! session.userData.lastName) {
 session.beginDialog('/profile/last');
} else {
 session.send(session.userData.lastName + session.userData.firstName + '・・・');
 session.send('覚えたぞ！！！');
}
});

//ファーストネームを聞く処理
bot.add('/profile/first', [
 function (session) {
     builder.Prompts.text(session, 'ファーストネーム教えて！！！');
 },
 function (session, results) {
     session.userData.firstName = results.response;
     session.endDialog();
 }
]);

//ラストネームを聞く処理
bot.add('/profile/last', [
 function (session) {
     builder.Prompts.text(session, 'ラストネーム教えて！！！');
 },
 function (session, results) {
     session.userData.lastName = results.response;
     session.endDialog();
 }
]);


/*
bot.add("/", function (session) {
	session.beginDialog("/waterFall");
})

bot.add("/waterFall", [
                     function (session) {
                    	 if (!session.userData.name) {
                    		 builder.Prompts.text(session, "こんにちわ！ところで、あなたは何て名前なの？");
                    	 } else {
                    		 next();
                    	 }
                     },
                     function (session, results) {
                    	 if (!session.userData.name) {
                    		 session.userData.name = results.response;
                        	 session.send("こんにちわ！" + session.userData.name + "さん、よろしくね！");
                    	 } else {
                    		 session.send("あ、こんにちわ" + session.userData.name + "さん。");
                    	 }
                    	 next();
                     },
                     function (session) {
                    	 builder.Prompts.choice("ところで" + session.userData.name + "さん、携帯は何使ってるんでしたっけ？", "iPhone|Android|ガラケー|糸電話|狼煙");
                     },
                     function (session, results) {
                    	 var res = results.response.entity;
						 if (res == "糸電話" || res == "狼煙") {
							session.send(res + "？はいはい、どうせそういうと思いましたよ・・・真面目に答えてくれないと先に進めないのでちゃんと答えてくださいね。");
							} else {
								session.send("あ、" + res + "を使ってるんですね！");
								session.userData.phone = res;
								next();
						 }
                     },
                     function (session) {
                    	 builder.Prompts.texts(session, "さてさて" + session.userData.phone + "使いの" + session.userData.name + "さん、どこにお勤めでしたっけ？");
                     },
                     function (session, results){
                    	 session.userData.company = results.response;
                    	 session.send("そうですか！" + session.userData.company + "に勤めてらっしゃるんですね！");
                    	 session.endDialog();
                     }
                     ]);
                     */

var server = restify.createServer();
server.post("/api/messages", bot.verifyBotFramework(), bot.listen());

server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(port, function () {
	console.log("%s listening to %s", server.name, server.url);
});
