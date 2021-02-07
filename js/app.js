console.log('First Project');

class Game {
	constructor() {
		this.isPlayersTurn = true;
		this.newGame();
	}
	newGame() {
		// todo: let player choose class
		this.player = new Player(new Wizard);
		this.enemy = new Enemy(new Monster);

		while (this.winLoseCheck() === 0){
			if(this.isPlayersTurn = !this.isPlayersTurn) {
				this.playerTurn();
			} else {
				this.enemyTurn();
			}
		}
		if (this.winLoseCheck === 1){
			alert(`Congratulations! You defeated the enemy`);
		} else {
			alert(`Bummer, you died.`);
		}
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
	}

	heavyAttack(enemy) {
		this.attack(enemy, this.heavyEnergy, this.heavyDamage);
	}

	lightAttack(enemy) {
		this.attack(enemy, this.lightEnergy, this.lightDamage);

	}

}

class Enemy extends Fighter {
	constructor (character) {
		super(character);
		this.attackEnergy = 3;
		this.attackDamage = 2;
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
	}
}
// todo: add classes (player and enemy classes)


//const game = new Game;







