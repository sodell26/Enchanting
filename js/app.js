console.log('First Project');

class Game {
	constructor() {
		this.isPlayersTurn = true;
		this.$enemyArea = $('.enemy-row .col');
		this.$playerBarArea = $('.player-row .player-health')
		this.newGame();
	}
	newGame() {
		// todo: let player choose class
		this.player = new Player(new Wizard);
		this.enemy = new Enemy(new Monster);
		this.$enemyArea.append(this.enemy.$enemyCard);
		this.$playerBarArea.append(this.player.$playerHealthCard);

		// while (this.winLoseCheck() === 0){
		// 	if(this.isPlayersTurn = !this.isPlayersTurn) {
		// 		this.playerTurn();
		// 	} else {
		// 		this.enemyTurn();
		// 	}
		// }
		// if (this.winLoseCheck === 1){
		// 	alert(`Congratulations! You defeated the enemy`);
		// } else {
		// 	alert(`Bummer, you died.`);
		// }
	}

	playerTurn() {
		// todo: give player a choice between heavy and light attack
		this.player.startTurn();
		let typeOfAttack = null;
		while (true){
			 typeOfAttack = prompt(`Use heavy or light attack?`);
			 if (typeOfAttack === 'heavy' || typeOfAttack === 'light') {
			 	break;
			 } else {
				alert(`That is not a proper attack, choose again.`)
			 }
		}
		if (typeOfAttack === 'heavy'){
			this.player.heavyAttack(this.enemy);
			console.log(`You attacked! You hit the ${this.enemy.character.name} for ${this.player.heavyDamage} and used ${this.player.heavyEnergy} energy. The ${this.enemy.character.name} has ${this.enemy.health} health left.`);
		}
		if (typeOfAttack === 'light'){
			this.player.lightAttack(this.enemy);
			console.log(`You attacked! You hit the ${this.enemy.character.name} for ${this.player.lightDamage} and used ${this.player.lightEnergy} energy. The ${this.enemy.character.name} has ${this.enemy.health} health left.`);
		} 
		
	}

	enemyTurn() {
		this.enemy.startTurn();
		this.enemy.enemyAttack(this.player);
		console.log(`The ${this.enemy.character.name} attacked! It hit you for ${this.enemy.attackDamage} and used ${this.enemy.attackEnergy} energy. You have ${this.player.health} health left.`);
	}

	winLoseCheck() {
		if (this.player.health <= 0){
			return -1;
		} else if (this.enemy.health <= 0){
			return 1;
		} 
		return 0;

	}


	// todo: use energy?
}

class Fighter {
	constructor(character) {
		this.setCharacter(character);

	}

	takeDamage(damage) {
		this.health -= damage;
	}

	attack(enemy, energy, damage) {
		this.energy -= energy;
		enemy.takeDamage(damage);
	}

	setCharacter(character) {
		this.character = character;
		this.health = character.health;
		this.energy = character.energy
	}

	startTurn() {
		this.addEnergy(2);
	}

	addEnergy(energy) {
		this.energy += energy;
		if (this.energy > this.character.energy) {
			this.energy = this.character.energy;
		}
	}
}

class Player extends Fighter {
	constructor(character) {
		super(character);
		this.heavyEnergy = 5;
		this.heavyDamage = 3;
		this.lightEnergy = 2;
		this.lightDamage = 1;
		this.createCard();
	}

	heavyAttack(enemy) {
		this.attack(enemy, this.heavyEnergy, this.heavyDamage);
	}

	lightAttack(enemy) {
		this.attack(enemy, this.lightEnergy, this.lightDamage);

	}

	createCard() {
		this.$energyBar = $('<div class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$healthBar = $('<div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$playerHealthCard = $('<div class="card"><div class="card-body"><h5 class="card-title">Health</h5><div class="progress player-health-bar"></div><h5class="card-title">Energy</h5><div class="progress player-energy-bar"></div></div></div>');
		this.$playerHealthCard.find('.player-health-bar').append(this.$healthBar);
		this.$playerHealthCard.find('.player-energy-bar').append(this.$energyBar);
	}

}

class Enemy extends Fighter {
	constructor(character) {
		super(character);
		this.attackEnergy = 3;
		this.attackDamage = 2;
		this.createCard();
	}

	createCard() {
		this.$energyBar = $('<div class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$healthBar = $('<div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$enemyCard = $(`<div class="card enemy-card"><img src="${this.character.picture}" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">Health</h5><div class="progress enemy-health-bar"></div><h5 class="card-title">Energy</h5><div class="progress enemy-energy-bar"></div></div></div>`);
		this.$enemyCard.find('.enemy-health-bar').append(this.$healthBar);
		this.$enemyCard.find('.enemy-energy-bar').append(this.$energyBar);

		

	}

	enemyAttack(enemy) {
		this.attack(enemy, this.attackEnergy, this.attackDamage);		
	}
}

class Character {

}

class Wizard extends Character {
	constructor() {
		super();
		this.energy = 20;
		this.health = 25;
		this.name = "wizard";
	}
}

class Monster extends Character {
	constructor() {
		super();
		this.energy = 15;
		this.health = 20;
		this.name = "monster";
		this.picture = "https://techcrunch.com/wp-content/uploads/2019/09/monster-dot-com.jpg?w=1390&crop=1";
	}
}
// todo: add classes (player and enemy classes)

$(()=> {

const game = new Game;

})








