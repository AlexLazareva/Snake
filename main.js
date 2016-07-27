$(document).ready(function() {
	// Параметры Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();

	// Сохраняем ширину ячейки в переменную
	var cw = 10;
	var d;
	var food;
	var score;

	// Создание змейки
	var snakeArray;

	function init()
	{
		d = "right"; // направление
		createSnake();
		createFood(); //Еда :)
		//теперь выведем очки
		score = 0;
 
		// Тепер заставим двигатся змейку используя таймер который будет вызывать функцию рисующую змейку
		//каждые 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 200);
	}
	init();

	function createSnake() {
		var length = 4;
		snakeArray = [];
		for (var i = length-1; i>=0; i--) 
		{
			snakeArray.push({x: i, y:20});
		}
	}

	function createFood() {
		food = {
			x: Math.round(Math.random()*(w-cw)/cw),
			y: Math.round(Math.random()*(h-cw)/cw),
		};
	}

	function paint() {
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);

		// Движение
		var nx = snakeArray[0].x;
		var ny = snakeArray[0].y;

		if (d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
		
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snakeArray)) {
			//restart
			init();
			return;
		}
		if (nx == food.x && ny == food.y) {
			var tail = {x: nx, y: ny};
			score++;
			createFood();
		} else {
			var tail = snakeArray.pop();
			tail.x = nx; tail.y = ny;
		}

		snakeArray.unshift(tail);

		for (var i = 0; i < snakeArray.length; i++) {
			var c = snakeArray[i];
			paintCell(c.x, c.y);
		}

		//Рисуем еду
		paintCell(food.x, food.y);
		var score_text = "Счет: " + score;
		ctx.fillText(score_text, 5, h-5);
	}

	function paintCell(x, y) {
		ctx.fillStyle = "#a4ca39";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}

	function check_collision(x, y, array) {
		for (var i = 0; i < array.length; i++) {
			if (array[i].x == x && array[i].y == y)
				return true;
		}
		return false;
	}

	//управление змеей
	$(document).keydown(function(e) {
		var key = e.which;

		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
	})
})