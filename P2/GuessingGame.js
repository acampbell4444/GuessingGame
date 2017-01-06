$(function() {

	$('#hint').text('Hint -4');
	var hint= false
	var game = newGame();
	$("#error, #error2").hide();
	$('.easy').prop("disabled",true);

	$('#player-input').click(function(){
		$('#submit').removeClass('spin');
		$('#points').text("Points: " + (10-game.pastGuesses.length - (localStorage.getItem('dificile') === 'easy' ? hint ? 4 : 0 : hint ? 1 : 0 )))
		$('.dif').hide();
	});

	$('#player-input').keyup(function(){
		var attempt=$('#player-input').val()
		if((attempt!="")&&(isNaN(attempt)||attempt <1||attempt>100 )){
			$('#submit').prop("disabled",true);
			$('#error').slideDown(); throw "no soup for you"
		}else{
			$('#submit').prop("disabled",false);
			$('#error').slideUp();
		}
	});

	$('#init').keyup(function(){
		$('#error2').slideUp();
		var attempt=$('#init').val()
		if(attempt===""||!(/^[a-zA-Z]+$/.test(attempt))||attempt.length<2){
			$('#submitInit').prop("disabled",true);
			if(!(/^[a-zA-Z]+$/.test(attempt))&&attempt!=''){$('#error2').slideDown(); throw "no soup for you"}
		}else{
			$('#submitInit').prop("disabled",false);
			$('#error2').slideUp();
		}
	});

	$('#submit').click(function(e) {
		e.preventDefault();
		$("#error").slideUp();
		$('#points').text("Points: " + (10-game.pastGuesses.length - (localStorage.getItem('dificile') === 'easy' ? hint ? 4 : 0 : hint ? 1 : 0 )))
		makeAGuess(game);
	});

	$('#hint').click(function() {
		hint=true
		$('#points').text('Points: ' + (10-game.pastGuesses.length - (localStorage.getItem('dificile') === 'easy' ? hint ? 4 : 0 : hint ? 1 : 0 )))
		var hints = game.provideHint();
		$('h1').text('The winning number is: ' + hints.map((e,i,a)=>i===a.length-1 ? "or " + e : e).join(', '));
		$('.dif').hide();
		$('#hint').prop("disabled",true);
	});

	$('#reset').click(function() {
		game = newGame();
		$('#player-input').val("");
		$('#init').val('')
		$('#player-input').show();
		$('#submit').show();
		$('#hint, #submit').prop("disabled",false);
		$('#submitInit').prop("disabled",true);
		$('#points').text("")
		$('.dif').show();
		$('#error2,#error').slideUp();
		$('#initials-form').hide();
		hint=false
	});

	$(".close").click(function(){
		$("#error, #error2").slideUp();
	});

	$("#enterInit").click(function(e){
		e.preventDefault();
		$("#initials").hide();
		$("#initials-form").fadeIn()
		$('#init').val('');
	});

	$("#declineInit").click(function(e){
		e.preventDefault();
		$("#initials").hide();
		$('#reset').trigger('click');
	});

	$("#submitInit").click(function(e){
		e.preventDefault();
		var init = $('#init').val();
		if(init)
		if(!(/^[a-zA-Z]+$/.test(init))||init.length<2){$('#error2').slideDown(); throw "no soup for you"}
		var playScore=10-game.pastGuesses.length - (localStorage.getItem('dificile') === 'easy' ? hint ? 4 : 0 : hint ? 1 : 0 )
		localStorage.setItem( 'highScore', playScore );
		localStorage.setItem('ldrs', localStorage.getItem( 'ldrs' )+', '+init + "  " + localStorage.getItem('highScore') + 
			' points')
		$('#error2').slideUp();
		$("#initials-form").hide();
		$('#reset').trigger('click');
	});

	$(".resetLeaders").click(function(e){
		e.preventDefault();
		localStorage.setItem( 'highScore',0);
		localStorage.setItem('ldrs','XXX  0 points') 
		$('.lead-list').empty()
	});

	$('.hard').click(function(e){
		e.preventDefault();
		localStorage.setItem('dificile','hard')
		$('#hint').text('Hint -1')
		$('.hard').prop("disabled",true);
		$('.easy').prop("disabled",false);
		$('#submit').css({'background-color': 'red'});
		$('#player-input').css({'color': 'red'});
	});

	$('.easy').click(function(e){
		e.preventDefault();
		localStorage.setItem('dificile','easy')
		$('#hint').text('Hint -4')
		$('.easy').prop("disabled",true);
		$('.hard').prop("disabled",false);
		$('#submit').css({'background-color': 'green'});
		$('#player-input').css({'color': 'green'});
	});

	$('#init').click(function(){
		$('#error2').slideUp();
	});


});

function generateWinningNumber(game,wN) {
	while(true){
		var x = Math.ceil(Math.random()*100);
		if(game){
			if(x!== game.winningNumber&&!wN.includes(x)&&!game.pastGuesses.includes(x)) {
				 	game.wN.push(x)
				 	return game.wN[game.wN.length-1];
			}
		}else{
			return x;
		}
	}
};

function shuffle(array) {
	var m = array.length, t, i;
	while (m) {
		i = Math.floor(Math.random() * m--);
		t = array[m];
		array[m] = array[i];
		array[i] = t;
	}
	return array;
};

function Game(){

	this.playersGuess=null;
	this.pastGuesses=[];
	this.winningNumber=generateWinningNumber();
	this.wN=[];
	hint=false
	$('h1').text('Play the Guessing Game!'); 
	$('#subtitle').text('Get 5 Tries to Guess a Number Between 1 and 100!'); 
	if(!localStorage.getItem( 'ldrs' )){$(".resetLeaders").trigger('click')}
	if(localStorage.getItem('ldrs'==null)){localStorage.setItem('ldrs', 'ZZZ 10')}
	var lead=localStorage.getItem( 'ldrs' )
	$('.lead-list').empty()
	var leaderArray = lead.split(', ').slice(1).sort((a,b)=>b.replace(/[^0-9\.]+/g, '')- a.replace(/[^0-9\.]+/g, '') ).slice(0,50);
	this.leaderArray = leaderArray
	leaderArray = leaderArray.map((e,i)=>" " + (i+1)+') ' + e)  ;
	for(var i = 0; i<leaderArray.length;i++){
		$('.lead-list').append("<li class='led'>"+leaderArray[i]+"</li>")
	}
	$('body').css({'background-image': "url('images/questionmarks.jpg')"});
	$('#app').css({'background-color': 'rgba(256, 256, 256, 0.5)'});
	$('.lives-left').css({'margin-left': '0px'})
	$('#guess-list').empty();
	$('.lives-left').empty();
	for(var i = 5; i >0; i--) {
		$('.lives-left').append("<li class='life'><span class='glyphicon glyphicon-heart'></span></li>")
	}
};

Game.prototype.difference=function(){
	return Math.abs(this.playersGuess-this.winningNumber);
};

Game.prototype.isLower=function(){
	return this.playersGuess < this.winningNumber;
};

Game.prototype.playersGuessSubmission=function(guess){
	if(isNaN(guess)||guess <1||guess>100){$('#error').slideDown(); throw "no soup for you"}
	this.playersGuess=guess;
	return this.checkGuess();
};

Game.prototype.checkGuess = function() {
	if(this.playersGuess===this.winningNumber) {
		$('#app').css({'background-color':'rgba(256,256,256,0.5)'});
		$('body').css({'background-image': "url('https://worleygig.files.wordpress.com/2012/04/winner.jpg')"});
		$('#hint, #submit').prop("disabled",true);
		$('#subtitle').text("Press the Reset button to play again!")
			$('#player-input').hide();
			$('#submit').hide();
			$('#initials').fadeIn();
		
		return 'You Win!'
	}
	else {
		if(this.pastGuesses.includes(this.playersGuess) ) {
			return 'You have already guessed that number.';
		}
		else {
			this.pastGuesses.push(this.playersGuess);
			$('#guess-list').append("<li class = guess>" + this.playersGuess+ "</li>");
			$('.glyphicon-heart').last().removeClass('glyphicon-heart').addClass('glyphicon-cloud').delay(800).queue(function(){
				$('.glyphicon-cloud').addClass('poof')
			});
			$('.lives-left').css({'margin-left': '+=27px'});

			if(this.pastGuesses.length === 5) {
				$('#app').css({'background-color':'rgba(256,256,256,0.5)'});
				$('body').css({'background-image': "url('images/sad.jpg')"});
				$('#hint, #submit').prop("disabled",true);
				$('#subtitle').text("Press the Reset button to play again!")
				$('#points').text("Points: 0") 
				return 'You Lose. The winning number was: ' + this.winningNumber + '.';
			}
			else {
				var diff = this.difference();
				if(this.isLower()) {
					$('#subtitle').text("Guess Higher!")
				} else {
					$('#subtitle').text("Guess Lower!")
				}
				if(diff < 10){ 
					$('#app').css({'background-color':'rgba(256,0,0,0.4)'});
					return'You\'re burning up!';
				}
				else if(diff < 25){
					$('#app').css({'background-color':'rgba(255,140,0,0.4)'});
					return'You\'re lukewarm.';
				}
				else if(diff < 50) {
					$('#app').css({'background-color':'rgba(224,255,255,0.4)'});
					return'You\'re a bit chilly.';
				}
				else {
					$('#app').css({'background-color':'rgba(0,0,255,0.4)'});
					return'You\'re ice cold!';
				}
			}
		}
	}
};

Game.prototype.provideHint=function(){
	var game=this;
	var Wn=game.wN
	var gw = generateWinningNumber;
	return localStorage.getItem('dificile')==='easy' ? shuffle([this.winningNumber,gw(game,Wn),gw(game,Wn),gw(game,Wn),gw(game,Wn),gw(game,Wn)]) :
	shuffle([this.winningNumber,gw(game,Wn),gw(game,Wn),gw(game,Wn),gw(game,Wn),gw(game,Wn),gw(game,Wn),gw(game,Wn),gw(game,Wn),gw(game,Wn)]);
};

var newGame = function() {
	$('#submit').addClass('spin')
	$('#submitInit').prop("disabled",true);
	if(localStorage.getItem('dificile')===null) {
		localStorage.setItem('dificile','easy')
	}
	localStorage.getItem('dificile') === 'easy' ? $('.easy').trigger('click') : $('.hard').trigger('click')
	$('#init').val('')
	return new Game();
};

function makeAGuess(game) {
	var guess = $('#player-input').val();
	var output = game.playersGuessSubmission(parseInt(guess,10));
	$('#player-input').val("");
	$('#heady').text(output);
}









