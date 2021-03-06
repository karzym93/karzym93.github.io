categories = ["Music","Film","Geography","Person"];
players = ["two", "three", "four"];
var jsonData;
$password = null;
$category = null;
var $numberOfPlayers;

function setCategories () {
	$category = $('#category');
	categories.forEach(function(item, index) {
		$category.append('<option value="' + item + '">' + item + '</option>');
	});
}

function setPlayers () {
	$howManyPlayers = $('#howManyPlayers');
	players.forEach(function(item, index) {
		$howManyPlayers.append('<option value="' + item + '">' + item + '</option>');
	});
}

function checkLength() {
	if ($('#password').val().length > 0)
		$('button').text("Let's play!");
	else
		$('button').text("Try to guess random password!");
}

function setCookie(name, value) {
	var d = new Date();
	d.setSeconds(d.getSeconds() + 10);
	var expires = "expires="+ d.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
  }

function showPlayers() {
	$('.playersNames').empty();
	$numberOfPlayers = $("#howManyPlayers").find("option:selected").index() + 2;
	for (i=1; i<=$numberOfPlayers; i++) {
		$('.playersNames').append('<label for="player' + i + '" class="col-12 col-md-6">Player ' + i + ' name:</label><input id="player' + i + '" class="col-12 col-md-6 form-control">');
	}
}

function redirectToGame() {
	$password = $password || $('#password').val();
	$category = ($('#password').val()?$('#category option:selected').text():$category);
	$player1 = $('#player1').val();
	$player2 = $('#player2').val();
	setCookie('category', $category);
	setCookie('password', $password);
	setCookie('player1', $player1);
	setCookie('player2', $player2);
	if ($('#player3').length) setCookie('player3', $('#player3').val());
	if ($('#player4').length) setCookie('player4', $('#player4').val());
	setCookie('numberOfPlayers', $numberOfPlayers);
	location.href='wheel/wheel.html';
}
//////////validation on button
function validate() {
	///check if player put the password, randomize it if not
	if (!$('#password').val() || $('#password').val().replace(/\s/g, '').length == 0) {		
		$.ajax({
			url : "lib/passwords.json",
			async: false,
			dataType: "text",
			success : function (data) {
				jsonData = JSON.parse(data);
			}
		});
		////randomize password from the library
		$category = $('#category').val();
		var numberOfPasswords = jsonData[$category].length;
		var passwordIndex = Math.floor(Math.random() * numberOfPasswords);
		$password = jsonData[$category][passwordIndex];
	}
	redirectToGame();
}


$(document).ready(function () {setCategories(); setPlayers();showPlayers();});


