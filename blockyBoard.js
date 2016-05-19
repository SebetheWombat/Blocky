var canvas = document.getElementById("play");
var cntxt = canvas.getContext("2d");
var keys = [];
var friction = .9;
var gravity = .2;
var numHap = 5;
var numMad = 4;
var winner = false;
var count = 0;

var hapBlockImg = new Image();
hapBlockImg.src = "happyBlock.png";
var madBlockImg = new Image();
madBlockImg.src = "angryBlock.png";

document.addEventListener("keydown", function(e){ 
	keys[e.keyCode] = true;
});
document.addEventListener("keyup", function(e){
	keys[e.keyCode] = false;
});

var plats = [
	{
		x:50,
		y:400,
		width:100,
		height:10
	},
	{
		x:0,
		y:260,
		width:40,
		height:10
	},
	{
		x:750,
		y:300,
		width:50,
		height:10
	},
	{
		x:475,
		y:100,
		width:175,
		height:10
	},
	{
		x:50,
		y:30,
		width:200,
		height:10
	},
	{
		x:50,
		y:175,
		width:100,
		height:10
	},
	{
		x:125,
		y:295,
		width:185,
		height:10
	},
	{
		x:610,
		y:225,
		width:140,
		height:10
	},
	{
		x:230,
		y:535,
		width:10,
		height:75
	},
	{
		x:230,
		y:530,
		width:100,
		height:10
	},
	{
		x:325,
		y:460,
		width:115,
		height:10
	},
	{
		x:425,
		y:375,
		width:175,
		height:10
	},
	{
		x:350,
		y:155,
		width:100,
		height:10
	},
	{
		x:0,
		y:95,
		width:70,
		height:10
	}
];

var blocky = {
	x:10,
	y:575,
	size: 10,
	speed:3,
	velX:0,
	velY:0,
	jumping:false
}

var happyBlock = {
	x:[],
	y:[],
	speed: [],
	state:[]
}

var madBlock = {
	x:[],
	y:[],
	speed:[],
	state:[]
}

var explode = {
	x:[],
	y:[],
	velX: [],
	velY: [],
	radius: []
}

function blockReset(){
	blocky.x = 10;
	blocky.y = 575;
	blocky.size = 10;
}

function drawExplosion(){
	for(var e = 0; e < explode.x.length; e++){
		cntxt.beginPath();
		cntxt.arc(explode.x[e], explode.y[e], explode.radius[e], 0, Math.PI * 2);
		cntxt.fillStyle = "yellow";
		cntxt.fill();
		cntxt.closePath();
		
		explode.radius[e] -= 2;
		if(explode.radius[e] <= 1){
			clearExplosion();
		}
		
		explode.x[e] += explode.velX[e];
		explode.y[e] += explode.velY[e];
	}
}

function clearExplosion(){
	explode.x = [];
	explode.y = [];
	explode.velX = [];
	explode.velY = [];
	explode.radius = [];
}

function gameReset(){
	blockReset();
	happyBlock.state = [];
	happyBlock.x = [];
	happyBlock.y = [];
	happyBlock.speed = [];
	clearExplosion();
	count = 0;
}

function drawHapBlock(){
	for(var h = 0; h < numHap; h++){
		// arranges happy blocks on different platforms
		happyBlock.x.push(plats[h].x);
		happyBlock.y.push(plats[h].y - 17);
		happyBlock.speed.push(1);
		happyBlock.state.push(0);
		// blocky contacts happyBlock
		if(blocky.x < happyBlock.x[h] + hapBlockImg.width && blocky.x + blocky.size > happyBlock.x[h]
			 && blocky.y < happyBlock.y[h] + hapBlockImg.height && blocky.y + blocky.size > happyBlock.y[h]){
				 // if happyBlock has not already been contacted 
				 if(happyBlock.state[h] === 0){	 
					 for(var angle = 0; angle <= 720; angle += 90){
						 //push happyBlock's coordinates to explode object
						 explode.x.push(happyBlock.x[h]);
						 explode.y.push(happyBlock.y[h]);
						 explode.radius.push(20);
						 var speed = 5;
						 //controls the speed and direction at which explode objects will move
						 explode.velX.push(speed * Math.cos(angle * Math.PI/180));
						 explode.velY.push(speed * Math.sin(angle * Math.PI/180));
					 }
					 count++;
				 }
				 happyBlock.state[h] = 1;
		}
		// if happyBlock has not already been contacted by blocky draw it to canvas
		if(happyBlock.state[h] === 0){
			cntxt.drawImage(hapBlockImg, happyBlock.x[h], happyBlock.y[h]);
		}
		// controls happyBlock movement along its platform
		if(happyBlock.x[h] < plats[h].x || happyBlock.x[h] + hapBlockImg.width > plats[h].x + plats[h].width){
			happyBlock.speed[h] = -happyBlock.speed[h];
		}
		happyBlock.x[h] += happyBlock.speed[h];
	}
	// controls happyBlock that is not on a platform
	happyBlock.x.push(canvas.width/2);
	happyBlock.y.push(583);
	happyBlock.speed.push(1);
	happyBlock.state.push(0);
	if(blocky.x < happyBlock.x[numHap] + hapBlockImg.width && blocky.x + blocky.size > happyBlock.x[numHap]
	 && blocky.y < happyBlock.y[numHap] + hapBlockImg.height && blocky.y + blocky.size > happyBlock.y[numHap]){
		 if(happyBlock.state[numHap] === 0){	 
			 for(var angle = 0; angle <= 720; angle += 90){
				 explode.x.push(happyBlock.x[numHap]);
				 explode.y.push(happyBlock.y[numHap]);
				 explode.radius.push(20);
				 var speed = 5;
				 explode.velX.push(speed * Math.cos(angle * Math.PI/180));
				 explode.velY.push(speed * Math.sin(angle * Math.PI/180));
			 }
			 count++;
		 }
		 happyBlock.state[numHap] = 1;
	 }
	if(happyBlock.state[numHap] === 0){
		cntxt.drawImage(hapBlockImg, happyBlock.x[numHap], happyBlock.y[numHap]);
	}
	if(happyBlock.x[numHap] < 240 || happyBlock.x[numHap] + hapBlockImg.width > canvas.width){
		happyBlock.speed[numHap] = -happyBlock.speed[numHap];
	}
	happyBlock.x[numHap] += happyBlock.speed[numHap];
	
	if(count > numHap){
		winner = true;
	}
}

function drawMadBlock(){
	for(var m = 0; m < numMad; m++){
		// arranges madBlock on different platforms
		var platsNum = m + numHap - 1;
		madBlock.x.push(plats[platsNum].x + plats[platsNum].width/2);
		madBlock.y.push(plats[platsNum].y - 17);
		madBlock.speed.push(1);
		cntxt.drawImage(madBlockImg, madBlock.x[m], madBlock.y[m]);
		// if blocky contacts madBlock decrease size of blocky until non-existant then reset
		if(blocky.x < madBlock.x[m] + madBlockImg.width && blocky.x + blocky.size > madBlock.x[m]
		 && blocky.y < madBlock.y[m] + madBlockImg.height && blocky.y + blocky.size > madBlock.y[m]){
			 blocky.size -= 1;
			 if(blocky.size <= 2){
				 gameReset();
			 }
		 }
		 //controls movement of madBlock along its platform
		if(madBlock.x[m] < plats[platsNum].x || madBlock.x[m] + madBlockImg.width > plats[platsNum].x + plats[platsNum].width){
			madBlock.speed[m] = -madBlock.speed[m];
		}
		madBlock.x[m] += madBlock.speed[m];
	}
	
	// controls madBlock not on a platform
	madBlock.x.push(600);
	madBlock.y.push(583);
	madBlock.speed.push(1);
	cntxt.drawImage(madBlockImg, madBlock.x[numMad], madBlock.y[numMad]);
	if(blocky.x < madBlock.x[numMad] + madBlockImg.width && blocky.x + blocky.size > madBlock.x[numMad]
	 && blocky.y < madBlock.y[numMad] + madBlockImg.height && blocky.y + blocky.size > madBlock.y[numMad]){
		 blocky.size -= 1;
		 if(blocky.size <= 0){
			 gameReset();
		 }
	 }
	if(madBlock.x[numMad] < 240 || madBlock.x[numMad] + madBlockImg.width > canvas.width){
		madBlock.speed[numMad] = -madBlock.speed[numMad];
	}
	madBlock.x[numMad] += madBlock.speed[numMad];
}

function drawBlocky(){
	cntxt.beginPath();
	cntxt.rect(blocky.x, blocky.y, blocky.size, blocky.size);
	cntxt.fillStyle = "#ffffff";
	cntxt.fill();
	cntxt.closePath();
}

function drawPlats(){
	for(var i = 0; i < plats.length; i++){
		cntxt.beginPath();
		cntxt.rect(plats[i].x, plats[i].y, plats[i].width, plats[i].height);
		cntxt.fillStyle = "black";
		cntxt.fill();
		cntxt.closePath();
	}
}

function colDetect(player, obj){
	// determines how far away center of objects are from each other along x and y axis
	var vectX = (player.x + (player.size/2)) - (obj.x + (obj.width/2));
	var vectY = (player.y + (player.size/2)) - (obj.y + (obj.height/2));
	// calc sum of half width and heights of 2 objects
	var halfWidth = (player.size/2) + (obj.width/2);
	var halfHeight = (player.size/2) + (obj.height/2);
	var playerHit = null;
	
	// if the distance between the center of 2 objects is less then the sum of their half widths/heights they are colliding
	if(Math.abs(vectX) < halfWidth && Math.abs(vectY) < halfHeight){
		// determine overlap
		var offsetX = halfWidth - Math.abs(vectX);
		var offsetY = halfHeight - Math.abs(vectY);
		
		// if blocks overlap push player in shortest distance so they no longer overlap
		if(offsetX >= offsetY){
			if(vectY > 0){
				playerHit = "top";
				player.y += offsetY;
			}
			else{
				playerHit = "bottom";
				player.y -= offsetY;
			}
		}
		else{
			if(vectX > 0){
				playerHit = "left";
				player.x += offsetX;
			}
			else{
				playerHit = "right";
				player.x -= offsetX;
			}
		}
	}
	// returns the direction in which the player is colliding with 2nd object
	return playerHit;
}
function moveBlocky(){
	// up arrow only works if blocky is not currently jumping
	if(keys[38] && !jumping){
		blocky.velY = -blocky.speed*2;
		jumping = true;
	}
	if(keys[39]){
		//increase blocky's velocity
		if(blocky.velX < blocky.speed){
			blocky.velX++;
		}
	}
	if(keys[37]){
		//decrease blocky's velocity
		if(blocky.velX > -blocky.speed){
			blocky.velX--;
		}
	}
	
	blocky.velX *= friction;
	blocky.velY += gravity;
	
	for(var p = 0; p < plats.length; p++){
		var playerStruck = colDetect(blocky, plats[p]);
		if(playerStruck === "left" || playerStruck === "right"){
			blocky.velX = 0;
		}
		else if(playerStruck === "top"){
			blocky.velY *= -1;
		}
		else if(playerStruck === "bottom"){
			blocky.velY = 0;
			jumping = false;
		}
	}
	
	blocky.x += blocky.velX;
	blocky.y += blocky.velY;
	
	// keeps blocky in canvas
	if(blocky.x < 0){
		blocky.x = 0;
	}
	else if(blocky.x + blocky.size > canvas.width){
		blocky.x = canvas.width - blocky.size;
	}
	if(blocky.y + blocky.size > canvas.height){
		blocky.y = canvas.height - blocky.size;
		jumping = false;
	}
}

function winScreen(){
	var textB = "Congratulations!";
	var text2 = "You did it!";
	// creates rainbow shadow effect
	cntxt.beginPath();
	cntxt.fillStyle = "green";
	cntxt.font = "45px Helvetica";
	cntxt.fillText(textB, canvas.width/3 - 30, canvas.height/3);
	cntxt.fillStyle = "yellow";
	cntxt.font = "45px Helvetica";
	cntxt.fillText(textB, (canvas.width/3 - 30) + 1, canvas.height/3 + 2);
	cntxt.fillStyle = "orange";
	cntxt.font = "45px Helvetica";
	cntxt.fillText(textB, (canvas.width/3 - 30) + 2, canvas.height/3 + 4);
	cntxt.fillStyle = "red";
	cntxt.font = "45px Helvetica";
	cntxt.fillText(textB, (canvas.width/3 - 30) + 3, canvas.height/3 + 6);
	cntxt.closePath();
	cntxt.beginPath();
	cntxt.fillStyle = "blue";
	cntxt.font = "40px Helvetica";
	cntxt.fillText(text2, canvas.width/2 - 100, canvas.height/2);
	cntxt.fillStyle = "green";
	cntxt.font = "40px Helvetica";
	cntxt.fillText(text2, (canvas.width/2 - 100) + 1, canvas.height/2 + 2);
	cntxt.fillStyle = "yellow";
	cntxt.font = "40px Helvetica";
	cntxt.fillText(text2, (canvas.width/2 - 100) + 2, canvas.height/2 + 4);
	cntxt.fillStyle = "orange";
	cntxt.font = "40px Helvetica";
	cntxt.fillText(text2, (canvas.width/2 - 100) + 3, canvas.height/2 + 6);
	cntxt.fillStyle = "red";
	cntxt.font = "40px Helvetica";
	cntxt.fillText(text2, (canvas.width/2 - 100) + 4, canvas.height/2 + 8);
	cntxt.closePath();
}
var main = function(){
	cntxt.clearRect(0,0,canvas.width,canvas.height);
	if(!winner){
		drawPlats();
		drawBlocky();
		moveBlocky();
		drawHapBlock();
		drawMadBlock();
		drawExplosion();
	}
	else if(winner){
		winScreen();
		if(keys[32]){
			gameReset();
			winner = false;
		}
	}
	
	requestAnimationFrame(main);
}

main();