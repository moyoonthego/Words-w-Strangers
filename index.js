'use strict';

let WSServer = require('ws').Server;
let server = require('http').createServer();
let app = require('./server.js');
let {Stage, Player} = require('./models/Model.js');

// Create web socket server on top of a regular http server
let wss = new WSServer({

  server: server
});

// Also mount the app here
server.on('request', app);

wss.on('close', function() {
    console.log('disconnected');
});
var game;

wss.broadcast = function(msg){
	for(let ws of this.clients){ 
		try {
            msg.words = ws.p.words;
			ws.send(JSON.stringify(msg));
		} catch(e) {
			console.log(e);
			ws.close();
		}
	}
}
var id = 1;
wss.on('connection', function(ws) {
	ws.id = id;
	id++;
	if (!game){
		game = new Stage();
	}
	ws.p = new Player(ws.id, "pizza");
	var r = game.initiate(ws.p)
	ws.send(JSON.stringify(r[0]));
	wss.broadcast(r[1]); 
	ws.on('message', function(message) {
		wss.broadcast(game.newMsg(ws.p, message)); 
	});
});

var port = process.env.PORT || 5000;
server.listen(port, function() {

  console.log(`http/ws server listening on ${port}`);
});
