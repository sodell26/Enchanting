console.log('First Project');

class Game {
	constructor() {
		this.isPlayersTurn = true;
		this.$enemyArea = $('.enemy-row .col');
		this.$playerBarArea = $('.player-row .player-health');
		this.$heavyAttackArea = $('.player-row .heavy-attack-container');
		this.$lightAttackArea = $('.player-row .light-attack-container');
		this.$playerCardArea = $('.player-row .hero-card');
		this.$weaponArea = $('.player-row .weapon-card');
		this.newGame();
	}
	newGame() {
		// todo: let player choose class
		this.player = new Player(new Wizard);
		this.enemy = new Enemy(new Monster);
		this.$enemyArea.append(this.enemy.$enemyCard);
		this.$playerBarArea.append(this.player.$playerHealthCard);
		this.$heavyAttackArea.append(this.player.$heavyAttackCard);
		this.$lightAttackArea.append(this.player.$lightAttackCard);
		this.$playerCardArea.append(this.player.$heroCard);
		this.$weaponArea.append(this.player.$weaponCard)
		this.playerTurn();
	}

	endGame() {
		if (this.winLoseCheck() === 1){
			alert(`Congratulations! You defeated the enemy`);
		} else {
			alert(`Bummer, you died.`);
		}
	}	

	playerTurn() {
		// todo: give player a choice between heavy and light attack
		this.player.startPlayerTurn();
		let typeOfAttack = null;

		this.player.$heavyAttackCard.on('click', ()=> {
			this.player.$heavyAttackCard.off('click');
			this.player.$lightAttackCard.off('click');
			this.player.heavyAttack(this.enemy);
			console.log(`You attacked! You hit the ${this.enemy.character.name} for ${this.player.heavyDamage} and used ${this.player.heavyEnergy} energy. The ${this.enemy.character.name} has ${this.enemy.health} health left.`);
			if (this.winLoseCheck() === 0 ){
				this.enemyTurn();
			} else {
				this.endGame();
			}
		});

		this.player.$lightAttackCard.on('click', ()=> {
			this.player.$lightAttackCard.off('click');
			this.player.$heavyAttackCard.off('click');
			this.player.lightAttack(this.enemy);
			console.log(`You attacked! You hit the ${this.enemy.character.name} for ${this.player.lightDamage} and used ${this.player.lightEnergy} energy. The ${this.enemy.character.name} has ${this.enemy.health} health left.`);
			if (this.winLoseCheck() === 0 ){
				this.enemyTurn();
			} else {
				this.endGame();
			}
		});		
	}

	enemyTurn() {
		this.enemy.startTurn();
		this.enemy.enemyAttack(this.player);
		console.log(`The ${this.enemy.character.name} attacked! It hit you for ${this.enemy.attackDamage} and used ${this.enemy.attackEnergy} energy. You have ${this.player.health} health left.`);
		if (this.winLoseCheck() === 0 ){
			this.playerTurn();
		} else {
			this.endGame();
		}	
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
		this.createCard();
		this.updateHealthBar();
		this.updateEnergyBar();
	}

	updateEnergyBar() {
		let percentage = 100 * this.energy/this.character.energy + '%';
		this.$energyBar.css('width', percentage)

	}

	updateHealthBar() {
		let percentage = 100 * this.health/this.character.health + '%';
		this.$healthBar.css('width', percentage)
	}

	takeDamage(damage) {
		this.health -= damage;
		this.updateHealthBar();
	}

	attack(enemy, energy, damage) {
		this.energy -= energy;
		this.updateEnergyBar();
		enemy.takeDamage(damage);
	}

	setCharacter(character) {
		this.character = character;
		this.health = character.health;
		this.energy = character.energy;
	}

	startTurn() {
		this.addEnergy(2);
	}

	addEnergy(energy) {
		this.energy += energy;
		if (this.energy > this.character.energy) {
			this.energy = this.character.energy;
		}
		this.updateEnergyBar();
	}
}

class Player extends Fighter {
	constructor(character) {
		super(character);
	}

	heavyAttack(enemy) {
		this.attack(enemy, this.heavyEnergy, this.heavyDamage);
	}

	lightAttack(enemy) {
		this.attack(enemy, this.lightEnergy, this.lightDamage);

	}

	createCard() {
		this.heavyEnergy = 5;
		this.heavyDamage = 3;
		this.lightEnergy = 2;
		this.lightDamage = 1;
		this.$energyBar = $('<div class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$healthBar = $('<div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$playerHealthCard = $('<div class="card"><div class="card-body"><h5 class="card-title">Health</h5><div class="progress player-health-bar"></div><h5class="card-title">Energy</h5><div class="progress player-energy-bar"></div></div></div>');
		this.$playerHealthCard.find('.player-health-bar').append(this.$healthBar);
		this.$playerHealthCard.find('.player-energy-bar').append(this.$energyBar);

		this.$heroCard = $(`<div class="card"><div class="hero-img" style="background-image: url('${this.character.picture}')"></div><div class="card-body"><h3 class="card-text">${this.character.name}</h3></div></div>`);

		this.$heavyAttackCard = $(`<div class="card"><img src="https://www.gransforsbruk.com/wp-content/uploads/475-large-carving-axe-1440x1026.jpg" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">Heavy Attack</h5><p class="card-text"><b>Attack:</b>${this.heavyDamage}</p><p class="card-text"><b>Energy:</b>${this.heavyEnergy}</p></div></div>`);

		this.$lightAttackCard = $(`<div class="card"><img src="https://www.gransforsbruk.com/wp-content/uploads/475-large-carving-axe-1440x1026.jpg" class="card-img-top" alt="..."><div class="card-body"><h5 class="card-title">Light Attack</h5><p class="card-text"><b>Attack:</b>${this.lightDamage}</p><p class="card-text"><b>Energy:</b>${this.lightEnergy}</p></div></div>`);

		this.$weaponCard = $(`<div class="card"><div class="hero-img" style="background-image: url('${this.character.weaponPicture}')"></div><div class="card-body"><h3 class="card-text">${this.character.weaponName}</h3></div></div>`);

	}

	startPlayerTurn() {
		this.startTurn();

	}

}

class Enemy extends Fighter {
	constructor(character) {
		super(character);
		this.attackEnergy = 3;
		this.attackDamage = 2;
	}

	createCard() {
		this.$energyBar = $('<div class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$healthBar = $('<div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$enemyCard = $(`<div class="card enemy-card"><div class="enemy-img" style="background-image: url('${this.character.picture}');"></div><div class="card-body"><h5 class="card-title">Health</h5><div class="progress enemy-health-bar"></div><h5 class="card-title">Energy</h5><div class="progress enemy-energy-bar"></div></div></div>`);
		this.$enemyCard.find('.enemy-health-bar').append(this.$healthBar);
		this.$enemyCard.find('.enemy-energy-bar').append(this.$energyBar);

		

	}

	enemyAttack(enemy) {
		this.attack(enemy, this.attackEnergy, this.attackDamage);		
	}
}

class Character {

}

class MonsterCharacter extends Character {

}

class Wizard extends Character {
	constructor() {
		super();
		this.energy = 20;
		this.health = 25;
		this.name = "wizard";
		this.picture = "https://images.squarespace-cdn.com/content/v1/55a81ab8e4b0d6293bf4f755/1543616178316-IOVJVEGMHM7WYH0DKMKF/ke17ZwdGBToddI8pDm48kB7Wg69NbBN3UJ65yaPjgwpZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpzy7r4cmDkEVZ6VvAvlVoeYnCn-DUv0WXnO1FJ9eOsUX2q0X2kEKL_rY34eESCHPaY/lego-wizard.jpg?format=300w";
		this.weaponPicture = "https://inclusive-solutions.com/wp-content/uploads/2015/11/flashing-magic-wand.jpg";
		this.weaponName = "Wand";
	}
}

class Ghost extends MonsterCharacter {
	constructor() {
		super();
		this.energy = 10;
		this.health = 12;
		this.name = "ghost";
		this.picture = "https://illustoon.com/photo/dl/3486.png";
	}
}

class Vampire extends MonsterCharacter {
	constructor() {
		super();
		this.energy = 15;
		this.health = 20;
		this.name = "vampire";
		this.picture = "https://images-na.ssl-images-amazon.com/images/I/81W9SaVK6nL._AC_SL1500_.jpg";
	}
}


class Ogre extends MonsterCharacter {
	constructor() {
		super();
		this.energy = 20;
		this.health = 24;
		this.name = "ogre";
		this.picture = "https://www.youngupstarts.com/wp-content/uploads/2013/11/Shrek_fierce.jpg";
	}
}

class Monster extends MonsterCharacter {
	constructor() {
		super();
		this.energy = 25;
		this.health = 30;
		this.name = "werewolf";
		this.picture = "https://www.pngkey.com/png/full/150-1504087_werewolf-free-icons-free-vector-icons-svg-psd.png";
	}
}


class SpaghettiMonster extends MonsterCharacter {
	constructor() {
		super();
		this.energy = 40;
		this.health = 40;
		this.name = "spaghetti monster";
		this.picture = "https://cdn.britannica.com/57/198157-050-503D66E9/artist-rendition-Flying-Spaghetti-Monster.jpg";
	}
}
// todo: add classes (player and enemy classes)

$(()=> {

const game = new Game;

})








