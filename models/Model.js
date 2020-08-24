class Stage{
	constructor(){
		this.restart()
	}

	response(){
		var c = -1;
		var retmsg = [this.msgs[this.msgs.length - 1]];
		for(var i = 0; i<this.players.length;  i++){
			c = this.players[i]
			if(c.words.length == 0){
				c = c.id;
				retmsg += "Player " + c + " Wins!";
				this.restart();
				break;
			}
		}
		return { winner: c, msgs: retmsg}
	}



	initiate(p){

		this.players.push(p);
	
		this.msgs.push("Player " + p.id + " has joined!\n");		
		return [{msgs: this.msgs.slice(0, this.msgs.length - 1), score: -1 }, this.response()];
	}

	newMsg(player, msg){
		// Check who msg is from
		// if they should get points
		var s = ""
		this.players.forEach(function(p){
			if (p.id != player.id){
				if(p.guess(msg)){
					s += "Player " + p.id + ", "
				}
			}
		})

		msg = "Player " + player.id + ": " + msg ;
		msg += s.length > 0 ? "\nPlayer " + player.id +" said " + s.substring(0, s.length - 2) + " word\n" : "\n"

		this.msgs.push(msg);
		
		console.log(msg)
		return this.response();
	}
	restart(){
		this.players = [];
		this.msgs = [];
	}
}

class Player{
	constructor(id, words){
		const word = ["elephant","eggplant","potato","banana", "battery", "water", "walking", "lonely", "ducky", "chainsaw", "fantastic", "stomach", "survival", "cave", "random", "thanks", "diamond", "hunter", "giant", "president"]
		this.words = [];
		for (var i =0; i<3; i++){
			this.shuffle(word);
			this.words.push(word.pop());
		}

		this.id = id;
	}

	guess(word){

		if (this.words.includes(word.toLowerCase())){
			this.words = this.words.filter( (value) => value != word.toLowerCase());
   			return true;
		}
		return false;
		
	}
	getGuessedWords(){
		return this.words.length;
	}
	shuffle(array) {
  		var currentIndex = array.length, temporaryValue, randomIndex;

  		// While there remain elements to shuffle...
  		while (0 !== currentIndex) {

    		// Pick a remaining element...
    		randomIndex = Math.floor(Math.random() * currentIndex);
    		currentIndex -= 1;

    		// And swap it with the current element.
    		temporaryValue = array[currentIndex];
    		array[currentIndex] = array[randomIndex];
    		array[randomIndex] = temporaryValue;
  		}

  		return array;
	}	
}



module.exports = {
	Stage: Stage, 
	Player: Player};
