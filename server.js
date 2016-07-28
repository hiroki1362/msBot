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

bot.add("/", function (session) {
	session.beginDialog("/waterFall");
})

bot.add("/waterFall", [
                     function (session, next) {
                    	 if (!session.userData.name) {
                    		 builder.Prompts.text(session, "こんにちわ！ところで、あなたは何て名前なの？");
                    	 } else {
                    		 next();
                    	 }
                     },
                     function (session, results, next) {
                    	 if (!session.userData.name) {
                    		 session.userData.name = results.response.replace("だよ", "");
                        	 session.send("こんにちわ！" + session.userData.name + "さん、よろしくね！");
                    	 } else {
                    		 session.send("あ、こんにちわ" + session.userData.name + "さん。");
                    	 }
                    	 next();
                     },
                     function (session) {
                    	 builder.Prompts.choice(session, "ところで" + session.userData.name + "さん、携帯は何使ってるんでしたっけ？", "iPhone|Android|ガラケー|糸電話|狼煙");
                     },
                     function (session, results, next) {
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
                    	 builder.Prompts.text(session, "さてさて" + session.userData.phone + "使いの" + session.userData.name + "さん、どこにお勤めでしたっけ？");
                     },
                     function (session, results, next){
                    	 session.userData.company = results.response.replace("だよ", "");
                    	 session.send("そうですか！" + session.userData.company + "に勤めてらっしゃるんですね！");
                    	 next();
                     },
                     function (session) {
                    	 session.send(session.userData.name + "さんは、" + session.userData.company + "に勤めていて" + session.userData.phone + "ユーザなんですね！むっちゃ変人ですね！");
                    	 session.userData.name = "";
                    	 session.userData.phone = "";
                    	 session.userData.campany = "";
                    	 session.endDialog();
                     }
                     ]);

var server = restify.createServer();
server.post("/api/messages", bot.verifyBotFramework(), bot.listen());

server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(port, function () {
	console.log("%s listening to %s", server.name, server.url);
});
