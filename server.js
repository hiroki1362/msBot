//初めてのBOT
var restify = require("restify");
var builder = require("botbuilder");

//BOTの作成
var bot = new builder.BotConnectorBot({appId: "YourAppId", appSecret: "YourAppSecret"});
bot.add("/", function (session) {
	session.send("よくわかんないけど、こんにちわーー！");
});

var server = restify.createServer();
server.post("/api/messages", bot.verifyBotFramework(), bot.listen());
server.listen(process.env.port || 3789, function () {
	console.log("%s listening to %s", server.name, server.url);
});
