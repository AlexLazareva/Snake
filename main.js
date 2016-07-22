$(document).ready(function(){
	//Canvas
	var canvas = $("#canvas")[0];
	var ctx = canvas.getContext("2d");
	var w = $("#canvas").width();
	var h = $("#canvas").height();
 
	// Cохраняем ширину ячейки в переменную для легкого управления
	var cw = 10;
	var d;
	var food;
	var score;
 
	// Создаем змейку
	var snake_array; // Массив ячеек для создания змеи
 
	function init()
	{
		d = "right"; // направление
		create_snake();
		create_food(); //Еда :)
		//теперь выведем очки
		score = 0;
 
		// Тепер заставим двигатся змейку используя таймер который будет вызывать функцию рисующую змейку
		//каждые 60ms
		if(typeof game_loop != "undefined") clearInterval(game_loop);
		game_loop = setInterval(paint, 200);
	}
	init();
 
	function create_snake()
	{
		var length = 4; //Длинна змеи
		snake_array = []; //Пустой массив для старта
		for(var i = length-1; i>=0; i--)
		{
			//Создаем горизонтальную змейку
			snake_array.push({x: i, y:20});
		}
	}
 
	//Теперь будем давать еду :)
	function create_food()
	{
		food = {
			x: Math.round(Math.random()*(w-cw)/cw), 
			y: Math.round(Math.random()*(h-cw)/cw), 
		};
		//Будет создавать ячейку с x/y между 0-44
	}
 
	//Теперь рисуем змейку
	function paint()
	{
		//Рисуем canvas 
		ctx.fillStyle = "white";
		ctx.fillRect(0, 0, w, h);
		ctx.strokeStyle = "black";
		ctx.strokeRect(0, 0, w, h);
 
		//Код отвечающий за движение змейки ниже.
		//Очень просто
		var nx = snake_array[0].x;
		var ny = snake_array[0].y;
 
		if(d == "right") nx++;
		else if(d == "left") nx--;
		else if(d == "up") ny--;
		else if(d == "down") ny++;
 
 
		//Теперь если голова змеи ударится об тело игра начнется заново
		if(nx == -1 || nx == w/cw || ny == -1 || ny == h/cw || check_collision(nx, ny, snake_array))
		{
			//restart игры
			init();
			return;
		}
 
		//Пишем код для прийома пищи змейкой :)
 
		if(nx == food.x && ny == food.y)
		{
			var tail = {x: nx, y: ny};
			score++;
			//Создаем новый кусочек
			create_food();
		}
		else
		{
			var tail = snake_array.pop(); //pops out the last cell
			tail.x = nx; tail.y = ny;
		}
		//Теперь змея может пообедать :)
 
		snake_array.unshift(tail); 
 
		for(var i = 0; i < snake_array.length; i++)
		{
			var c = snake_array[i];
 
			paint_cell(c.x, c.y);
		}
 
		//Рисуем еду
		paint_cell(food.x, food.y);
		//Выводим счет
		var score_text = "Счет: " + score;
		ctx.fillText(score_text, 5, h-5);
	}
 
	//Красим змею в зеленый
	function paint_cell(x, y)
	{
		ctx.fillStyle = "#A4CA39";
		ctx.fillRect(x*cw, y*cw, cw, cw);
		ctx.strokeStyle = "white";
		ctx.strokeRect(x*cw, y*cw, cw, cw);
	}
 
	function check_collision(x, y, array)
	{
		for(var i = 0; i < array.length; i++)
		{
			if(array[i].x == x && array[i].y == y)
			 return true;
		}
		return false;
	}
 
	//самое важное управление голодной змеей :)
	$(document).keydown(function(e){
		var key = e.which;
 
		if(key == "37" && d != "right") d = "left";
		else if(key == "38" && d != "down") d = "up";
		else if(key == "39" && d != "left") d = "right";
		else if(key == "40" && d != "up") d = "down";
		//Теперь змея управляемая
	})
 
})