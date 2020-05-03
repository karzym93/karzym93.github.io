categories = ["-- Select --","Music","Film","Geography","Place"];
var jsonData;
$password = null;
$category = null;

function setCategories () {
	$category = $('#category');
	categories.forEach(function(item, index) {
		$category.append('<option value="' + item + '">' + item + '</option>');
	});
}

function checkLength() {
	if ($('#password').val().length > 0)
		$('button').text("Let's play!");
	else
		$('button').text("...or try to guess random password!");
}

function setCookie(name, value) {
	var d = new Date();
	d.setSeconds(d.getSeconds() + 10);
	var expires = "expires="+ d.toUTCString();
	document.cookie = name + "=" + value + ";" + expires + ";path=/";
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
	console.log(document.cookie);
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
		////randomize category and password from the library
		var numberOfCategories = Object.keys(jsonData).length;
		var categoryNumber = Math.floor(Math.random() * numberOfCategories);
		$category = Object.keys(jsonData)[categoryNumber];
		var numberOfPasswords = jsonData[$category].length;
		var passwordIndex = Math.floor(Math.random() * numberOfPasswords);
		$password = jsonData[$category][passwordIndex];
	}
	redirectToGame();
}


$(document).ready(function () {setCategories();});


