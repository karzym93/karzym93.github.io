var password = getCookie('password');
var category = getCookie('category');
var numberOfPlayers = getCookie('numberOfPlayers');
var passwordWithoutSpaces = password.replace(/\s/g, '');
var personPlaying = 1;
var wheelSpinned = false;
var wheelParts = 20;
var prize = 0;
var correctGuess = false;
var wrongAudio = new Audio('../sound/wrong.mp3');
var spinningTime = 7000; 
var lettersTab = ["A", "Ą", "B", "C", "Ć", "D", "E", "Ę", "F", "G", "H", "I", "J", "K", "L",
"Ł", "M", "N", "Ń", "O", "P", "Q", "R", "S", "Ś", "T", "U", "V", "W", "X", "Y", "Z", "Ź", "Ż"]
var vowelCost = 500;

function generatePlayers() {
	$players = $('#players');
	for (i = numberOfPlayers; i > 0; i--) {
		$players.prepend('<div class="player col-6 col-md-' + 12/numberOfPlayers + '" id="player' + i + '"><div class="photo" style=\'background-image: url("../img/player' + i + '.png")\'></div><div class="caption inactive" id="playerName' + i + '">Player ' + i + ': <span>0</span></div></div>');
	}
	$('#playerName1')
			.addClass('active')
			.removeClass('inactive');
}

//////get players' names
function getName() {
	for (i = 1; i <= numberOfPlayers; i++) {	
		var ithPlayerName = getCookie('player' + i ) || ('Player '+i);	
		$('#playerName' + i).html(ithPlayerName + ": <span>0</span>");
	}
}

//download password set on previous page
function getCookie(cookieName) {
	var name = cookieName + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
	  var c = ca[i];
	  while (c.charAt(0) == ' ') {
		c = c.substring(1);
	  }
	  if (c.indexOf(name) == 0) {
		return c.substring(name.length, c.length);
	  }
	}
	return "";
}

function changePerson() {
	$('#playerName' + personPlaying)
			.addClass('inactive')
			.removeClass('active');
	personPlaying = (personPlaying % numberOfPlayers) + 1;
	$('#playerName' + personPlaying)
			.removeClass('inactive')
			.addClass('active');
	var wheelSpinned = false;
}

/////create array with prizes and shuffle it
function shuffle() {
	var array = Array(wheelParts).fill(0).map((e, i) => i * 50);
	var i = array.length,
		j = 0,
		temp;
	while (i--) {
		j = Math.floor(Math.random() * (i + 1));
		temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	array[array.indexOf(0)] = "Bankrupt";
	return array;
}

function generateAlphabet() {
	lettersTab.forEach(e => {
		$('.passwordContainer').append('<div class="letter" id="letter' + e	+ '"><span class="innerLetter">' + e + '</span></div>');
		//$('#letter' + e).on('click', checkLetter(e));
		
		$('#letter' + e).on('click', function(){checkLetter(e)});
		///// add tooltip for vowels
		if (checkIfVowel(e)) {
			$('#letter' + e).addClass('customTooltip');
		}
	});
}

///generate place for password which will be guessed
function generatePasswordDiv(password) {
	var $emptyPlaces = $('.emptyPlaces');
	var $passwordContainer = $('.passwordContainer');
	$('.comment').append(category);
	var words = password.split(' ');
	$passwordContainer.append('<div class="emptyPlaces">');
	for (i=0; i<words.length; i++) {
		 //check if additional new line needed
		if ($('.emptyPlaces').last().children().length + words[i].length > 12 && document.body.clientWidth > 768
				|| $('.emptyPlaces').last().children().length + words[i].length > 8 && document.body.clientWidth <= 768)
			$passwordContainer.append('<div class="emptyPlaces">');
		else if ($('.emptyPlaces').last().children().length)
			$passwordContainer.children().last().append('&nbsp;&nbsp;&nbsp;&nbsp;');
		for (j=0; j<words[i].length;j++) {
			////check for non-letter signs
			if (!/[A-ZĄĆĘŁŃÓŚŻŹ]/.test(words[i].charAt(j).toUpperCase())) {
				$passwordContainer.children().last().append('<div class="disabledLetter"></div>');
				$('.disabledLetter').last().append('<span class="innerPasswordLetter">' + words[i].charAt(j) + '</span>');
			}
			else {
				$passwordContainer.children().last().append('<div class="disabledLetter"></div>');
			}
		}
	}
}

String.prototype.setSign = function (index, sign) {
	return this.substr(0, index) + sign + this.substr(index + 1);
}
/**********************
 * make letter blink ***
 **********************/
function blink(i) {
	var blink = setInterval(changeBackground, 500);
	var letterAudio = new Audio('../sound/letter.mp3');
	letterAudio.play();
	function changeBackground() {
		if ($('.disabledLetter:eq(' + i + ')').hasClass('guessedLetter'))
			$('.disabledLetter:eq(' + i + ')').removeClass('guessedLetter');
 		 else
			$('.disabledLetter:eq(' + i + ')').addClass('guessedLetter');
	}
	function stopBlinking() {
		clearInterval(blink);
	}		
	setTimeout(stopBlinking, 2500);	
}
/////check if chossen letter is a vowel
function checkIfVowel(letterNumber) {
	return /^[AĄEĘIOÓUY]$/.test(/*lettersTab[*/letterNumber/*]*/);
}
//////check if current person can choose a vowel
function checkVowelForPlayer(personPlaying) {
	$points = $('#playerName' + personPlaying).find('span').text();
	if ($points >= vowelCost) {
		$('#playerName' + personPlaying).find('span').text($points - vowelCost);
		return true;
	}
	else {
		return false;
	}
}

/***************************************
 * check if letter appears in password *
 * *********************************** */
var wheelSpinning = false;
var isVowel;
async function checkLetter(letterValue) {
	if (!wheelSpinning ///// wheel is not spinning
				&& (wheelSpinned || correctGuess)) {
		correctGuess = false;
		/// check if is vowel chosen and player has enough points to reveal it
		isVowel = checkIfVowel(letterValue);
		if (isVowel && !checkVowelForPlayer(personPlaying)) {
			return;
		};
		for (i = 0; i < passwordWithoutSpaces.length; i++) {
			/// check if guess not correct
			if (passwordWithoutSpaces.charAt(i).toUpperCase() != $('#letter' + letterValue).children().text())
				continue;			
			$('.disabledLetter:eq(' + i + ')')
					.html('<span class="innerPasswordLetter">' + $('#letter' + letterValue).text() + '</span>')
					.addClass('guessedLetter');	
			blink(i);
			$('#letter' + letterValue).addClass('correctLetter');
			await new Promise(r => setTimeout(r, 500));
			
			//$passwordGuessed = $('#passwordGuessed');					
			$checkPassword = $('#checkPassword');
			if (prize != 'Bankrupt' && !isVowel) {
				var sum = parseInt($('#playerName' + personPlaying).children().text()) + prize;
				$('#playerName' + personPlaying).find('span').text(sum);
			}
			correctGuess = true;
		}
		if ($('.innerPasswordLetter').length == passwordWithoutSpaces.length) {
			$('#password').val(password);
			setTimeout(function(){checkPasswordCorrectness()},2500);
			$('#passwordGuessed').css('visibility', 'hidden');
		}
		//else
		//	$passwordGuessed.css('visibility', 'unset');

		if (!correctGuess) {
			$('#letter' + letterValue).addClass('wrongLetter');
			$('#passwordGuessed').css('visibility', 'hidden');
			wrongAudio.play();
			changePerson();
		}
	}
	wheelSpinned = false;
	correctGuess = false;
}
/*************************************
 * Check if typed password is correct
 * ***********************************/
function checkPasswordCorrectness() {
	if (password.toUpperCase() == $('#password').val().toUpperCase()) {
		var winAudio = new Audio('../sound/win.mp3');
		winAudio.play();
		$('.disabledLetter').each(function(index) {
			$(this).html('<span class="innerPasswordLetter">' + passwordWithoutSpaces.charAt(index).toUpperCase() + '</span>')
					.addClass('guessedLetter');	
		});

		setTimeout(function() {
			if (confirm("Congratulations " + $('.player').find('.active').html().split(':')[0] + "! Wanna play again?") == true) {
				location.href = '../start.html';
			};
		}, 2000);
	}
	else {
		wrongAudio.play();
		$('#passwordGuessed').css('visibility', 'hidden');
		$('#password').val(null);
		changePerson();
		wheelSpinned = false;
	}
}
$(document).on('click', '#checkPassword', function() { checkPasswordCorrectness(); });

var prizes = shuffle();

function getCurrentAngle() {
	var el = document.getElementById("wheel");
	var st = window.getComputedStyle(el, null);
	var tr = st.getPropertyValue("-webkit-transform") ||
        st.getPropertyValue("-moz-transform") ||
        st.getPropertyValue("-ms-transform") ||
        st.getPropertyValue("-o-transform") ||
        st.getPropertyValue("transform") ||
		"FAIL";
		if (tr == 'none') {
			values = [0,0];
		}
		else {
			var values = tr.split('(')[1],
			values = values.split(')')[0],
			values = values.split(',');
		}
	var a = values[0];
	var b = values[1];

	var radians = Math.atan2(b, a);
	if ( radians < 0 ) {
		radians += (2 * Math.PI);
	}
	var angle = Math.round( radians * (180/Math.PI));
	return angle;
}

function spin($) {
	var $wheel = $('#wheel');
	$wheel.css('cursor', 'pointer');
	
	/**
	 * Calculate mouse rotation relative to $wheel center
	 * @param  int  mouseX
	 * @param  int  mouseY
	 */
  	const radius	= $wheel.outerWidth() / 2;
  	const centerX	= $wheel.offset().left + radius;
	const centerY	= $wheel.offset().top + radius;
  
	function getDegrees(mouseX, mouseY) {
		const radians	= Math.atan2(mouseX - centerX, mouseY - centerY);
		const degrees	= Math.round((radians * (180 / Math.PI) * -1) + 100);
		return degrees;
	}
	var degrees;
	var angle = angle || 0;
	var curAngle; 
	$wheel.on('mousedown', function(event) {
		$('#passwordGuessed').css('visibility', 'hidden');
		// Calculate the mouse position in degrees
		if (!wheelSpinned) {
			const clickDegrees = getDegrees(event.pageX, event.pageY);
			$wheel.css('transition','');
			$wheel.bind('mousemove', clickDegrees, function(event) {
				// Calculate the mouse move position, removing starting point
				degrees = getDegrees(event.pageX, event.pageY) - clickDegrees;
				curAngle = getCurrentAngle();
				//Calculate current position of the wheel while moving the mouse
				var sum = angle + degrees;
				$wheel.css('transform', 'rotate('+sum+'deg)');
			});
		}
	});
	$wheel.on('mouseup', function() {
		////don't do anything if wheel is already spinned
		if (wheelSpinned)
			return;
		////if wheel not spinned
		(function (){
			wheelSpinning = true;
			curAngle = getCurrentAngle();
			var randomPower = Math.floor(100*Math.random() + 300);
			angle = angle + Math.abs(curAngle*2) + randomPower;
			$wheel.css('transform', 'rotate(' + angle + 'deg)')
			$wheel.css('transition', 'transform ' + spinningTime/1000 + 's');
			var partNumber = Math.floor(angle % 360 / (360 / wheelParts));
			prize = prizes[(partNumber) % wheelParts];
			console.log("value: " + prizes[(partNumber) % wheelParts]);

			////change player in bankrupt case
			//if (prize=='Bankrupt') {
			setTimeout(function() {
				if (prize=='Bankrupt') {
					$('#playerName' + personPlaying).find('span').text(0);
					var fail = new Audio('../sound/fail.mp3')
					fail.play();
					changePerson();
					wheelSpinned = false;
				}
				else
					$('#passwordGuessed').css('visibility', 'visible');
			}, spinningTime+10);
			//}
		})();
		$wheel.unbind('mousemove');
		wheelSpinned = true;
		setTimeout(function() {wheelSpinned = true; wheelSpinning = false;}, spinningTime);
	});
};
///// allow enter key on typing password
function allowEnter(){
	$passwordTyped = $('#password');
	$passwordTyped.keydown(function(e) {
		if (e.keyCode === 13)
			$('#checkPassword').click();
	});
}

///// allow typing letters instead of clicking
$(document).on('keypress', function (e) {
	///// check if cursor is in the textfield with password
	if (e.target.nodeName == 'INPUT') return;
	checkLetter(String.fromCharCode(e.which).toUpperCase());
});

$(document).ready(function() {generatePlayers();getName();generatePasswordDiv(password); generateAlphabet();spin($);allowEnter();});
