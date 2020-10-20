function drawWheel() {
	var c = document.getElementById("wheel");
	var wheelWidth = $('.wheelContainer')[0].clientWidth * 0.8; 
	var wheelHeight = $('.wheelContainer')[0].clientWidth * 0.8; 
	c.width = wheelWidth;	
	c.height = wheelHeight;
	wheelCenterX = wheelWidth;
	wheelCenterY = wheelHeight;
	var ctx = c.getContext("2d");
	var length = wheelHeight * 0.9;
	ctx.beginPath();
	ctx.arc(wheelCenterX/2, wheelCenterY/2, length/2, 0, 2 * Math.PI);
	for (i = 0; i<wheelParts; i++) {
		ctx.moveTo(wheelCenterX/2 + 1.1*(Math.cos(Math.PI * i * (360 / wheelParts) / 180) * length/2), 
				wheelCenterY/2 + 1.1*(Math.sin(Math.PI * i * (360 / wheelParts) / 180) * length/2));
		ctx.lineTo(wheelCenterX/2, wheelCenterY/2);
		ctx.stroke();
	}
	ctx.font = wheelWidth / 20 + "px Arial";
	ctx.textAlign = "left";
	ctx.translate(wheelCenterX/2, wheelCenterY/2);

	///draw and fill parts
	for (i=0; i<wheelParts; i++) {
		//randomize fill color
		r = Math.floor(Math.random() * 155 + 100);
		g = Math.floor(Math.random() * 155 + 100);
		b = Math.floor(Math.random() * 155 + 100);
		//fill part of the wheel
		ctx.beginPath();
		ctx.moveTo(0,0);
		ctx.fillStyle="rgb(" + r + "," + g + "," + b + ")";
		ctx.rotate(-2 * Math.PI / wheelParts);
		ctx.arc(0, 0, length/2, 0, 2 * Math.PI / wheelParts);
		ctx.fill();
		ctx.save();
		//add text value of the part
		ctx.textBaseline="middle";
		ctx.textAlign = "end";
		ctx.rotate(Math.PI/wheelParts);
		ctx.fillStyle = "rgb(0,0,0)";
		ctx.strokeText(prizes[i],length/2 - 10,0);
		ctx.fillText(prizes[i],length/2 - 10,0);
		ctx.closePath();
		ctx.stroke();
		ctx.restore();
		
	}
	
	///draw a circle inside of wheel
	ctx.beginPath();
	ctx.arc(0,0, wheelWidth / 5,0,Math.PI*2);
	ctx.fillStyle='#afa100';
	ctx.fill();	
	
	ctx.globalCompositeOperation='source-atop';
	
	ctx.shadowOffsetX = wheelHeight;
	ctx.shadowOffsetY = 0;
	ctx.shadowBlur = 5;
	ctx.shadowColor = 'rgba(30,30,30,1)';	
	ctx.beginPath();
	ctx.arc(0-wheelWidth,0,wheelWidth / 5,0,Math.PI*2);
	ctx.stroke();
	ctx.stroke();
	ctx.stroke();
	
	ctx.globalCompositeOperation='source-over';
	////write text in it
	ctx.save();
	ctx.closePath();
	ctx.beginPath();
	ctx.fill();
	ctx.textBaseline="middle";
	ctx.textAlign="center";
	ctx.fillStyle = "#1f1f1f";
	ctx.font = "bold " + Math.floor(wheelWidth / 20) + "px Wide Latin";
	ctx.fillText("Wheel",0,-wheelWidth / 15);
	ctx.fillText("of",0,0);
	ctx.fillText("Fortune",0,wheelWidth / 15);
	ctx.closePath();
	ctx.stroke();
  	ctx.restore();

	/////////////////////
	/////draw arrow/////
	////////////////////
	var c = document.getElementById("arrow");
	c.height = wheelCenterY;
	var ctx = c.getContext("2d");
	ctx.beginPath();
	ctx.moveTo(30, wheelHeight/2-15);
	ctx.lineTo(0, wheelHeight/2);
	ctx.lineTo(30, wheelHeight/2+15);
	ctx.lineTo(30, wheelHeight/2-15);
	ctx.closePath();
	ctx.stroke();
	ctx.fillStyle="red";
	ctx.fill();
}

$(document).ready(function() {drawWheel();});