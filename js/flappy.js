/*!
   Flappy bird game
   Copyright (c) 2019 Gagik Harutyunyan
   gagharut@gmail.com
*/

const game = document.querySelector('.game');
const scoreMove = document.querySelector('.score-move');
const playBlock = document.querySelector('.start');
const best = document.querySelector('.best');

let wingPos = 13;
let player = {};
let keys = {};
let pipe = {};

if(localStorage.getItem('flyingBird')) {
	best.textContent = 'Best score ' + localStorage.getItem('flyingBird');
}

const start = () => {
	player.inplay = true;
	player.step = 4;
	player.score = 0;
	game.innerHTML = '';
	playBlock.classList.add('hide');
	let bird = document.createElement('div');
    bird.setAttribute('class', 'bird');
    let wing = document.createElement('span');
	wing.setAttribute('class', 'wing');
	bird.appendChild(wing);
	game.appendChild(bird);
			
	player.x = bird.offsetTop;
	player.y = bird.offsetLeft;

	player.pipe = 0;
	let spacing = 450;
	let howMuch = Math.floor(game.offsetWidth/spacing);

	for(let i = 0;i < howMuch;i++) {
		buildPipe(player.pipe * spacing);
	}
	
	window.requestAnimationFrame(play);
}

const play = () => {
	let bird = document.querySelector(".bird");
    let wing = document.querySelector(".wing");
	if(player.inplay){
		let move = false;
		if((keys.ArrowUp && player.x > 10) || keys.Space) {
			player.x -= player.step * 2.5;
			move = true;
		};

		if(keys.ArrowDown && player.x < game.offsetHeight - 50) {
			player.x += player.step;
			move = true;
		};
		if(keys.ArrowLeft && player.y > 5) {
			player.y -= player.step;
			move = true;
		};
		if(keys.ArrowRight && player.y < game.offsetWidth - 80) {
			player.y += player.step;
			move = true;
		};

		if(move){
			wingPos = wingPos === 13? 20: 13;
			wing.style.top = wingPos + 'px';
		}

		if(player.x > game.offsetHeight - 50) {
			gameOver();
		}

		player.x += player.step * 1.25;
		bird.style.top = player.x + 'px';
		bird.style.left = player.y + 'px';
		let counter = 0;
		pipe.el.forEach(el=>{
			pipe.y = el.offsetLeft;
			pipe.y -= player.step * 0.7;
			el.style.left = pipe.y + 'px';
			if(pipe.y < 0){
				el.parentElement.removeChild(el);
				counter++;
			}

			if (isCollide(el, bird)) {
				gameOver(bird);
			}
		})

		counter = counter/2;

		for(let x = 0; x < counter;x++){
			buildPipe(0);
		}
		player.score++;
		scoreMove.textContent = player.score;
		window.requestAnimationFrame(play);
	}
}


const buildPipe = (start) => {
	let randomHexColor = Math.random().toString(16).substr(-6);

	const totalHeight = game.offsetHeight;
	const totalWidth = game.offsetWidth;
	player.pipe++;
	let startPos = start + totalWidth;

	let pipe1 = document.createElement('div');
	pipe1.classList.add('pipe');
	pipe1.height = Math.floor(Math.random() * 400);
	pipe1.style.height = pipe1.height + 'px';
	pipe1.style.left = startPos + 'px';
	pipe1.style.top = 0;
	pipe1.style.backgroundColor = `#${randomHexColor}`;
	game.appendChild(pipe1);

	let spacingMiddle = Math.floor(Math.random() * 200) + 150;

	let pipe2 = document.createElement('div');
	pipe2.classList.add('pipe');
	pipe2.style.height = totalHeight - pipe1.height - spacingMiddle + 'px';
	pipe2.style.left = startPos + 'px';
	pipe2.style.bottom = 0;
	pipe2.style.backgroundColor = `#${randomHexColor}`;
	game.appendChild(pipe2);
	pipe.el = document.querySelectorAll('.pipe');
}


const pressOn = (e) => {
	e.preventDefault();
	keys[e.code] = true;

};

const pressOff = (e) => {
	e.preventDefault();
	keys[e.code] = false;
};

const isCollide = (a, b) => {
	let aRect = a.getBoundingClientRect();
	let bRect = b.getBoundingClientRect();
	return !(
		(aRect.bottom < bRect.top) || (aRect.top > bRect.bottom) || (aRect.right < bRect.left) || (aRect.left > bRect.right))
}

const gameOver = () => {
	let bird = document.querySelector(".bird");
	bird.style.transform = 'translateX(10px) rotate(-180deg)';
	playBlock.classList.remove('hide');
	player.inplay = false;
	
	const gameLS = localStorage.getItem('flyingBird');
		if (gameLS === null) {
			localStorage.setItem('flyingBird', JSON.stringify(player.score));
			best.textContent = 'Best score ' + player.score;
		} else {
			if(player.score > gameLS){
				localStorage.setItem('flyingBird', JSON.stringify(player.score));
				best.textContent = 'Best score ' + player.score;
			};
		}
};

playBlock.addEventListener('click',start);
document.addEventListener('keydown',pressOn);
document.addEventListener('keyup',pressOff);