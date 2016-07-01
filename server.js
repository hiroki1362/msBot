//初めてのBOT
var restify = require("restify");
var builder = require("botbuilder");

//BOTの作成
var bot = new builder.BotConnectorBot({appId: process.env.BOTFRAMEWORK_APPID, appSecret: process.env.BOTFRAMEWORK_APPSECRET});
bot.add("/", function (session) {
	session.send("よくわかんないけど、こんにちわーー！あなたは、" + session.message.text + "と言いましたね！？");
});

var server = restify.createServer();
server.post("/api/messages", bot.verifyBotFramework(), bot.listen());

server.get(/.*/, restify.serverStatic({
	"directory": ".",
	"default": "index.html"
}));

server.listen(process.env.port || 3789, function () {
	console.log("%s listening to %s", server.name, server.url);
});
