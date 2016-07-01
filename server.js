//初めてのBOT
var restify = require("restify");
var builder = require("botbuilder");

//BOTの作成
var bot = new builder.BotConnectorBot({appId: "infodex_DevBot", appSecret: "3dc068bae546425eaa3d5d300eaf1193"});
//var bot = new builder.BotConnectorBot({appId: "", appSecret: ""});
bot.add("/", function (session) {
	session.send("よくわかんないけど、こんにちわーー！あなたは、「 " + session.message.text + " 」と言いましたね！？");
});

var server = restify.createServer();
server.post("/api/messages", bot.verifyBotFramework(), bot.listen());

server.get(/.*/, restify.serveStatic({
	"directory": ".",
	"default": "index.html"
}));

server.listen(process.env.port || 3978, function () {
	console.log("%s listening to %s", server.name, server.url);
});
