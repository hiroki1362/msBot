//初めてのBOT
var restify = require("restify");
var builder = require("botbuilder");
var port = process.env.PORT || 8080;
var botConnectorOptions = { 
	    appId: process.env.BOTFRAMEWORK_APPID, 
	    appSecret: process.env.BOTFRAMEWORK_APPSECRET 
	};
var url = "https://api.projectoxford.ai/luis/v1/application?id=" + process.env.LuisAppId +"&subscription-key=" + process.env.LuisSubscriptionKey;

var nameSetLuis = new builder.LuisRecognizer(url);
var luisDialog = new builder.LuisRecognizer(url);
var intents = new builder.IntentDialog({recognizers: [luisDialog]});
//var luisDialog = new builder.LuisDialog(url);

//BOTの作成
var bot = new builder.BotConnectorBot(botConnectorOptions);
bot.dialog("/", intents);
intents.matches("what_day", function (session, args) {
	var date = builder.EntityRecognizer.findEntity(args.entities, "builtin.datetime.date");
	if (date != undefined && date.resolution != undefined) {
		var d = new Date(date.resolution.date);
		var day = "日月火水木金土"[d.getDay()];
		session.send("その日は「" + day + "曜日」です！" );
	} else {
		session.send("ちょっと何言ってるのかわかりません。")
	}
})

/*bot.dialog("/", function (session) {
					 session.Prompts.text(session, "こんにちは！まずは、あなたの名前を入力してくださいね！")
                	 session.beginDialog("/askName");
                 });

bot.add("/askName", nameSetLuis);

//bot.add("/startLuis", luisDialog);
*/

/*
luisDialog.on("what_day", function (session, args) {
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
		session.send("ちょっと何言ってるのかわかりません。")
	}
});



luisDialog.onBegin(function (session, args) {
	session.send("Hello!! 私は人工知能チャットなんデスが、なぜか設定がEnglishなんデス。日本語にしたいトキは、「I'd like to speak Japanese.」と入力してくださいYO！")
})
luisDialog.onDefault(function (session, args) {
	session.send("質問を理解できませんでした・・・もう一度、お願いします。")
});
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
