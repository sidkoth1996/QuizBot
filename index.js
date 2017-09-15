/** 
This is the main entry point for the QuizBot. 
Author: Siddharth Kothari 
Date: 11th September, 2017
**/

var app = require('express')();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var string = require('string');
var jsonfile = require('jsonfile');
var leaderboard = require('./leaderboard.js');
var stopword = require('stopword');
var uc = require('upper-case');

const PORT = 8081;

//Question sets with random unique integers between 1 and 30
const question_set_1 = [6,3,47,23,20,41,29,28,11,43,14,38];
const question_set_2 = [48,17,40,20,21,29,8,23,22,6,32,24];
const question_set_3 = [44,34,39,27,7,14,6,17,23,8,32,24];
const question_set_4 = [17,18,28,26,36,21,29,25,34,44,24,0];
const question_set_5 = [5,29,8,0,36,13,41,3,31,48,30,38];

//Keep track of all the states
const States = {
	state_start: "state_start",
	state_category: "state_category",
	state_begin_quiz: "state_begin_quiz",
	state_question_1: "state_question_1",
	state_question_2: "state_question_2",
	state_question_3: "state_question_3",
	state_question_4: "state_question_4",
	state_question_5: "state_question_5",
	state_question_6: "state_question_6",
	state_question_7: "state_question_7",
	state_question_8: "state_question_8",
	state_question_9: "state_question_9",
	state_question_10: "state_question_10",
	state_question_11: "state_question_11",
	state_question_12: "state_question_12",
	state_end: "state_end"
};
 
var user_name; //User name
var user_score; //User score
var user_category; //Category decided by the user
var current_state; //Current state in the finite state machine
var previous_random_number; //Previous random number so that two consecutive users do not get the same set of questions
var current_question_set = []; //Stored the question set for the current user
var current_question_file; //Contains the json file with the questions for individual categories

leaderboard.createNewLeaderboard();

app.get('/',function(req,res) {
	res.sendFile(__dirname +'/index.html');
});

//Event fired when the user just began the chat
io.on('connection', function(socket) {
	console.log("User connected with ID: "+socket.id);

	state_start(); //Send a welcome message
	initialiseScore(); //Set score to 0
	setState(States.state_start);


	//Event triggered when user sends a message 
	socket.on('user message', function(msg) {

		//Debugging purposes
		console.log(msg);
		console.log(getState());
		
		if(getState() == States.state_start) {
			let temp_name = stopword.removeStopwords(msg.split(' '));
			setName(temp_name.join(' '));
			setState(States.state_category); //Assign next state
			state_category();
		}
		else if(getState() == States.state_category) {
			let question_file; 
			let temp_msg = uc(msg);

			if (temp_msg == 1 || string(temp_msg).include('ENTERTAINMENT')) {
				setCategory("Entertainment");

				question_file = __dirname + "/questions/entertainment.json";

				current_question_file = jsonfile.readFileSync(question_file);

				setState(States.state_begin_quiz);
				state_begin_quiz();
			}
			else if (temp_msg == 2 || string(temp_msg).include('SPORTS')) {
				setCategory("Sports");

				question_file = __dirname + "/questions/sports.json";

				current_question_file = jsonfile.readFileSync(question_file);

				setState(States.state_begin_quiz);
				state_begin_quiz();
			}
			else {
				state_did_not_understand();
				setState(States.state_category);
				state_category();
			}
		}
		else if(getState() == States.state_begin_quiz) {
			let temp_msg = uc(msg);
			if(!string(temp_msg).include('START')) {
				state_did_not_understand();
				state_begin_quiz();
			}
			else {
				setState(States.state_question_1);
				state_question_1();
			}
		}
		else if(getState() == States.state_question_1) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[0]].answer;
			let options = current_question_file[current_question_set[0]].options;

			console.log(options);
			let index_of_correct_answer = options.indexOf(correct_answer);

			//index_of_correct_answer + 1 because user will input 1 for array element that is at index 0

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore(); 
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_2);
			state_question_2();

		}
		else if(getState() == States.state_question_2) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[1]].answer;
			let options = current_question_file[current_question_set[1]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_3);
			state_question_3();
		}
		else if(getState() == States.state_question_3) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[2]].answer;
			let options = current_question_file[current_question_set[2]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_4);
			state_question_4();
		}
		else if(getState() == States.state_question_4) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[3]].answer;
			let options = current_question_file[current_question_set[3]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_5);
			state_question_5();
		}
		else if(getState() == States.state_question_5) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[4]].answer;
			let options = current_question_file[current_question_set[4]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_6);
			state_question_6();
		}
		else if(getState() == States.state_question_6) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[5]].answer;
			let options = current_question_file[current_question_set[5]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_7);
			state_question_7();
		}
		else if(getState() == States.state_question_7) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[6]].answer;
			let options = current_question_file[current_question_set[6]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			//index_of_correct_answer + 1 because user will input 1 for array element that is at index 0
			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_8);
			state_question_8();
		}
		else if(getState() == States.state_question_8) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[7]].answer;
			let options = current_question_file[current_question_set[7]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_9);
			state_question_9();
		}
		else if(getState() == States.state_question_9) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[8]].answer;
			let options = current_question_file[current_question_set[8]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			//index_of_correct_answer + 1 because user will input 1 for array element that is at index 0

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_10);
			state_question_10();
		}
		else if(getState() == States.state_question_10) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[9]].answer;
			let options = current_question_file[current_question_set[9]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			//index_of_correct_answer + 1 because user will input 1 for array element that is at index 0

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_11);
			state_question_11();
		}
		else if(getState() == States.state_question_11) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[10]].answer;
			let options = current_question_file[current_question_set[10]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_question_12);
			state_question_12();
		}
		else if(getState() == States.state_question_12) {

			let temp_msg = uc(msg);
			let correct_answer = current_question_file[current_question_set[11]].answer;
			let options = current_question_file[current_question_set[11]].options;
			let index_of_correct_answer = options.indexOf(correct_answer);

			if(string(temp_msg).include(index_of_correct_answer + 1) || string(temp_msg).include(uc(correct_answer))) {
				console.log("Correct answer");
				
				io.emit('correct answer', {});

				//Increase score
				incrementScore();
			
			}
			else {
				console.log("Wrong answer");
				
				io.emit('wrong answer', {});
			}

			setState(States.state_end);
			state_end();
			leaderboard.addScore(getName(), getScore());

		}
		else if(getState() == States.state_end) {

			if(!string(msg).include('restart')) {
				state_did_not_understand();
				state_end();
			}
			else {
				setState(States.state_start);
				state_start();
			}

			io.emit('update leaderboard', leaderboard.returnLeaderboard());
			console.log(leaderboard.returnLeaderboard());
		}
	});

	
	//Timer up event
	socket.on('end timer', function() {
		console.log("Timer has ended");
		setState(States.state_end);
		state_end();
	});

	//Event triggered when the user has disconnected the chat
	socket.on('disconnect', function() {
		console.log("User has disconnected with ID: "+socket.id);
	});

});

var state_start = function() {
	io.emit('bot message', {'msg': 'Hello, I am QuizBot. What is your name?', 'score': getScore()});
};

var state_category = function() {
	io.emit('bot message', {'msg': 'Nice to meet you '+ getName()+ '. What category do you pick? 1)Entertainment 2)Sports?', 'score': getScore()});
};

var state_begin_quiz = function() {
	io.emit('bot message', {'msg': 'Great, I shall ask you questions related to '+getCategory()+". You have 1 minute to answer 12 questions. Type 'start'", 'score': getScore()});
};

var state_did_not_understand = function() {
	io.emit('bot message', {'msg': 'Sorry I did not understand, how about we try again?', 'score':getScore()});
};

var state_question_1 = function() {

	var current_random_number;

		//Generate random number between 0 to 4 and check if current_random_number != previous_random_number

		do{
			current_random_number = Math.floor(Math.random() * 5);
		}
		while(current_random_number == previous_random_number);

		previous_random_number = current_random_number; //Assign previous random number to current random number

		switch(current_random_number) {
			case 0:
				current_question_set = question_set_1;
				break;
			case 1:
				current_question_set = question_set_2;
				break;
			case 2:
				current_question_set = question_set_3;
				break;
			case 3:
				current_question_set = question_set_4;
				break;
			case 4:
				current_question_set = question_set_5;
				break;
		}
	let question = current_question_file[current_question_set[0]].question;
	let options = current_question_file[current_question_set[0]].options;

	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_2 = function() {
	
	let question = current_question_file[current_question_set[1]].question;
	let options = current_question_file[current_question_set[1]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_3 = function() {
	
	let question = current_question_file[current_question_set[2]].question;
	let options = current_question_file[current_question_set[2]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_4 = function() {
	
	let question = current_question_file[current_question_set[3]].question;
	let options = current_question_file[current_question_set[3]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_5 = function() {

	let question = current_question_file[current_question_set[4]].question;
	let options = current_question_file[current_question_set[4]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_6 = function() {
	
	let question = current_question_file[current_question_set[5]].question;
	let options = current_question_file[current_question_set[5]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_7 = function() {
	
	let question = current_question_file[current_question_set[6]].question;
	let options = current_question_file[current_question_set[6]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_8 = function() {
	
	let question = current_question_file[current_question_set[7]].question;
	let options = current_question_file[current_question_set[7]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_9 = function() {
	
	let question = current_question_file[current_question_set[8]].question;
	let options = current_question_file[current_question_set[8]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_10 = function() {
	
	let question = current_question_file[current_question_set[9]].question;
	let options = current_question_file[current_question_set[9]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_11 = function() {
	
	let question = current_question_file[current_question_set[10]].question;
	let options = current_question_file[current_question_set[10]].options;
	
	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_question_12 = function() {
	let question = current_question_file[current_question_set[11]].question;
	let options = current_question_file[current_question_set[11]].options;

	io.emit('bot message', {'msg': question, 'options': options, 'score': getScore()});
};

var state_end = function() {

	io.emit('bot message', {'msg': 'Thank you for playing '+getName()+' Your score is '+getScore()+' To restart type "restart".', 'score':getScore()});
};

//Getter and setter functions
var setName = function(name) {
	user_name = name;
};

var getName = function() {
	return user_name;
};

var initialiseScore = function() {
	user_score = 0;
};

var incrementScore = function() {
	user_score += 1;
};

var getScore = function() {
	return user_score;
};

var setState = function(state) {
	current_state = state;
};

var getState = function() {
	return current_state;
};

var setCategory = function(category) {
	user_category = category;
};

var getCategory = function() {
	return user_category;
};


server.listen(PORT);
console.log("QuizBot running on port "+PORT);