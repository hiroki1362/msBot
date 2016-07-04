//初めてのBOT
var restify = require("restify");
var builder = require("botbuilder");
var port = process.env.PORT || 8080;
/*var botConnectorOptions = { 
	    appId: process.env.BOTFRAMEWORK_APPID, 
	    appSecret: process.env.BOTFRAMEWORK_APPSECRET 
	};
	*/
var botConnectorOptions = { 
	    appId: process.env.LuisAppId,
	    appSecret: process.env.LuisSubscriptionKey 
	};
var url = "https://api.projectoxford.ai/luis/v1/application?id=" + process.env.LuisAppId +"&subscription-key=" + process.env.LuisSubscriptionKey;
var dialog = new builder.LuisDialog(url);

//BOTの作成
/*var bot = new builder.BotConnectorBot(botConnectorOptions);
bot.add("/", function (session) {
	session.send("よくわかんないけど、こんにちわーー！あなたは、「 " + session.message.text + " 」と言いましたね！？");
});
*/

var bot = new builder.BotConnectorBot(botConnectorOptions);
bot.add("/", dialog);

dialog.on("what_day", function (session, args) {
	console.log('message:');
    console.log(session.message);
	var date = builder.EntityRecognizer.findEntity(args.entities, "builtin.datetime.date");
	console.log('date:');
    console.log(date);
	if (date != undefined && date.resolution != undefined) {
		var d = new Date(date.resolution.date);
		var day = "日月火水木金土"[d.getDay()];
		session.send("その日は「" + day + "曜日」です！" );
	} else {
		session.send("日付を取得できませんでした・・・。")
	}
});

dialog.onDefault(function (session, args) {
	session.send("質問を理解できませんでした・・・もう一度、お願いします。")
});

var server = restify.createServer();
server.post("/api/messages", bot.verifyBotFramework(), bot.listen());

server.get(/.*/, restify.serveStatic({
	'directory': '.',
	'default': 'index.html'
}));

server.listen(port, function () {
	console.log("%s listening to %s", server.name, server.url);
});
