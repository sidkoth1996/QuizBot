/**
This file contains functions for adding and retrieving user name and scores from a json file 
Author: Siddharth Kothari 
Date: 12th September, 2017
**/



var jsonfile = require('jsonfile');

var temp_leaderboard;

const leaderboard_file = __dirname + "/leaderboard_file.json";

exports.addScore = function(name, score) {

	let temp = jsonfile.readFileSync(leaderboard_file);

	temp.push({'name':name, 'score':score});
	jsonfile.writeFileSync(leaderboard_file, temp);

};

exports.createNewLeaderboard = function() {

	jsonfile.writeFileSync(leaderboard_file, []);

};

exports.returnLeaderboard = function() {

	let obj = jsonfile.readFileSync(leaderboard_file);

	obj.sort(function(a,b) {
		return b.score > a.score;
	});

	obj.sort();

	return obj;
	
};
