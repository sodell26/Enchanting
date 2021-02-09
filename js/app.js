console.log('First Project');

class Game {
	constructor() {
		this.isPlayersTurn = true;
		this.$enemyArea = $('.enemy-row .col');//establising the enemy row so I can add stuff to it
		this.$playerBarArea = $('.player-row .player-health');//establishing where the bars will go so I can add to it
		this.$heavyAttackArea = $('.player-row .heavy-attack-container');//establishing to add to it
		this.$lightAttackArea = $('.player-row .light-attack-container');//establishing to add to it
		this.$playerCardArea = $('.player-row .hero-card');//establishing to add to it
		this.$weaponArea = $('.player-row .weapon-card');//establishing to add to it
		this.newGame(); //starts the game, might need to move since I'm going to have player start with a different page
	}
	newGame() {
		// todo: let player choose class
		this.player = new Player(new Wizard);//creates the player and the character type, just using "wizard" right now to get it functional
		//need to make it so player can choose character type. Array maybe?
		this.enemy = new Enemy(new Monster);//same as player, player won't be choosing, but array may be best here too
		this.$enemyArea.append(this.enemy.$enemyCard);//adds enemy card to correct spot
		this.$playerBarArea.append(this.player.$playerHealthCard);//adds health card to spot
		this.$heavyAttackArea.append(this.player.$heavyAttackCard);//adds heavy attk to spot
		this.$lightAttackArea.append(this.player.$lightAttackCard);//add light attk to spot
		this.$playerCardArea.append(this.player.$heroCard);//adds hero card to spot
		this.$weaponArea.append(this.player.$weaponCard)//adds weapon card to spot
		this.playerTurn();//player attacks first
	}

	endGame() { //to check if either the enemy or player won
		if (this.winLoseCheck() === 1){
			alert(`Congratulations! You defeated the enemy`);
		} else {
			alert(`Bummer, you died.`);
		}
	}	

	playerTurn() { //allows player to fight
		this.player.startPlayerTurn();//right now, just adds energy
		let typeOfAttack = null;

		if (this.player.energy < this.player.heavyEnergy){
			this.player.$heavyAttackCard.on('click', ()=> {
				this.player.$heavyAttackCard.off('click');
				alert('You do not have enough energy to make that move.');
			});
		} else {
			this.player.$heavyAttackCard.on('click', ()=> {//heavy attack is picked
				this.player.$heavyAttackCard.off('click');//this and below keeps player from being able to attack when it's not their turn
				this.player.$lightAttackCard.off('click');
				this.player.heavyAttack(this.enemy);
				console.log(`You attacked! You hit the ${this.enemy.character.name} for ${this.player.heavyDamage} and used ${this.player.heavyEnergy} energy. The ${this.enemy.character.name} has ${this.enemy.health} health left.`);
				if (this.winLoseCheck() === 0 ){ //if health is both good for player and enemy, move to monster's turn
					this.enemyTurn();
				} else {
					this.endGame();
				}
			});
		}

		this.player.$lightAttackCard.on('click', ()=> {//light attack is picked
			this.player.$lightAttackCard.off('click');//keeps them from playing off turn
			this.player.$heavyAttackCard.off('click');
			this.player.lightAttack(this.enemy);
			console.log(`You attacked! You hit the ${this.enemy.character.name} for ${this.player.lightDamage} and used ${this.player.lightEnergy} energy. The ${this.enemy.character.name} has ${this.enemy.health} health left.`);
			if (this.winLoseCheck() === 0 ){//same as heavy attack
				this.enemyTurn();
			} else {
				this.endGame();
			}
		});		
	}

	enemyTurn() {
		this.enemy.startTurn();//right now, just adds energy
		this.enemy.enemyAttack(this.player);//tells where enemy to attack
		console.log(`The ${this.enemy.character.name} attacked! It hit you for ${this.enemy.attackDamage} and used ${this.enemy.attackEnergy} energy. You have ${this.player.health} health left.`);
		if (this.winLoseCheck() === 0 ){// same as for player
			this.playerTurn();
		} else {
			this.endGame();
		}	
	}

	winLoseCheck() {//shorter way to check for health status
		if (this.player.health <= 0){
			return -1;
		} else if (this.enemy.health <= 0){
			return 1;
		} 
		return 0;

	}


	// todo: use energy?
}

class Fighter {//both for player and enemies
	constructor(character) {
		this.setCharacter(character);
		this.createCard();//creates the main card
		this.updateHealthBar();//makes sure the health is updated with a percentage so that the bar from bootstrap works
		this.updateEnergyBar();//same as health
	}

	updateEnergyBar() {//makes energy a percentage then updates code so the amount colored in changes
		let percentage = 100 * this.energy/this.character.energy + '%';
		this.$energyBar.css('width', percentage)

	}

	updateHealthBar() { //same as energy
		let percentage = 100 * this.health/this.character.health + '%';
		this.$healthBar.css('width', percentage)
	}

	takeDamage(damage) { //updates health to reflect how much damage given by opponent
		this.health -= damage;
		this.updateHealthBar();//update bar again
	}

	attack(enemy, energy, damage) {
		this.energy -= energy;
		this.updateEnergyBar();
		//need to make it so they can't chose an attack if not enough energy
		enemy.takeDamage(damage);//opponent changes health equal to amount of damage
	}

	setCharacter(character) {
		this.character = character;//sets type
		this.health = character.health;//pulls in the character type health total
		this.energy = character.energy;//pulls in the character type energy total
	}

	startTurn() { //player and enemies get +2 energy at start of turn
		this.addEnergy(2);
		//need to add update energy bar?
	}

	addEnergy(energy) {//this is in case I want to add potions, and to make it so start turn can add energy
		this.energy += energy;
		if (this.energy > this.character.energy) {
			this.energy = this.character.energy;
		}
		this.updateEnergyBar();//updates the bar
	}
}

class Player extends Fighter { //has different methods that Fighter
	constructor(character) {
		super(character);
	}

	heavyAttack(enemy) {//self explanatory
		this.attack(enemy, this.heavyEnergy, this.heavyDamage);
	}

	lightAttack(enemy) {//self explanatory
		this.attack(enemy, this.lightEnergy, this.lightDamage);

	}

	createCard() { //create hero cards (including energy/health, type, weapon, attacks)
		this.heavyEnergy = 5;
		//make this and belwo three programmable with character type?
		this.heavyDamage = 3;
		this.lightEnergy = 0;
		this.lightDamage = 1;
		this.$energyBar = $('<div class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>'); //from boostrap, moved here from html so I could visualize it there first
		this.$healthBar = $('<div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$playerHealthCard = $('<div class="card"><div class="card-body"><h5 class="card-title">Health</h5><div class="progress player-health-bar"></div><h5class="card-title">Energy</h5><div class="progress player-energy-bar"></div></div></div>');//added classes of 'player-health-bar' and 'player-energy-bar'
		this.$playerHealthCard.find('.player-health-bar').append(this.$healthBar);//finds the class I added within $playerHealthCard, appends the health bar to it
		this.$playerHealthCard.find('.player-energy-bar').append(this.$energyBar);

		this.$heroCard = $(`<div class="card"><div class="hero-img" style="background-image: url('${this.character.picture}')"></div><div class="card-body"><h3 class="card-text">${this.character.name}</h3></div></div>`);

		this.$heavyAttackCard = $(`<div class="card"><img src="https://www.gransforsbruk.com/wp-content/uploads/475-large-carving-axe-1440x1026.jpg" class="card-img-top" alt="heavy attack"><div class="card-body"><h5 class="card-title">Heavy Attack</h5><p class="card-text"><b>Attack:</b>${this.heavyDamage}</p><p class="card-text"><b>Energy:</b>${this.heavyEnergy}</p></div></div>`);

		this.$lightAttackCard = $(`<div class="card"><img src="https://www.gransforsbruk.com/wp-content/uploads/475-large-carving-axe-1440x1026.jpg" class="card-img-top" alt="light attack"><div class="card-body"><h5 class="card-title">Light Attack</h5><p class="card-text"><b>Attack:</b>${this.lightDamage}</p><p class="card-text"><b>Energy:</b>${this.lightEnergy}</p></div></div>`);

		this.$weaponCard = $(`<div class="card"><div class="hero-img" style="background-image: url('${this.character.weaponPicture}')"></div><div class="card-body"><h3 class="card-text">${this.character.weaponName}</h3></div></div>`);

	}

	startPlayerTurn() { //made this separate because will probably need to add more to it than just add energy
		this.startTurn();

	}

}

class Enemy extends Fighter { //different from Fighter, but simpler than Player
	constructor(character) {
		super(character);
		this.attackEnergy = 3;
		//make these programmable to type
		this.attackDamage = 2;
	}

	createCard() { //same as with Player, but simpler
		this.$energyBar = $('<div class="progress-bar bg-info" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$healthBar = $('<div class="progress-bar bg-danger" role="progressbar" style="width: 25%" aria-valuenow="25" aria-valuemin="0" aria-valuemax="100"></div>');
		this.$enemyCard = $(`<div class="card enemy-card"><div class="enemy-img" style="background-image: url('${this.character.picture}');"></div><div class="card-body"><h5 class="card-title">Health</h5><div class="progress enemy-health-bar"></div><h5 class="card-title">Energy</h5><div class="progress enemy-energy-bar"></div></div></div>`);
		this.$enemyCard.find('.enemy-health-bar').append(this.$healthBar);
		this.$enemyCard.find('.enemy-energy-bar').append(this.$energyBar);

		

	}

	enemyAttack(enemy) {//same as with Player
		this.attack(enemy, this.attackEnergy, this.attackDamage);		
	}
}

class Character { //don't need to add anything to this yet, but wanted something for character types and enemies to extend from in case I need to add to later

}

class MonsterCharacter extends Character {//lots of enemies, this should help with DRY hopefully

}

class Wizard extends Character {//I like this set up, unless I change weapons to being their own thing
	constructor() {
		super();
		this.energy = 20;
		this.health = 30;
		this.name = "wizard";//used for the dialogue and card
		this.picture = "https://images.squarespace-cdn.com/content/v1/55a81ab8e4b0d6293bf4f755/1543616178316-IOVJVEGMHM7WYH0DKMKF/ke17ZwdGBToddI8pDm48kB7Wg69NbBN3UJ65yaPjgwpZw-zPPgdn4jUwVcJE1ZvWQUxwkmyExglNqGp0IvTJZUJFbgE-7XRK3dMEBRBhUpzy7r4cmDkEVZ6VvAvlVoeYnCn-DUv0WXnO1FJ9eOsUX2q0X2kEKL_rY34eESCHPaY/lego-wizard.jpg?format=300w";
		this.weaponPicture = "https://inclusive-solutions.com/wp-content/uploads/2015/11/flashing-magic-wand.jpg";
		this.weaponName = "Wand";
	}
}

class Warrior extends Character {
	constructor() {
		super();
		this.energy = 30;
		this.health = 20;
		this.name = 'warrior';
		this.picture = 'https://img.brickowl.com/files/image_cache/large/lego-spartan-warrior-minifigure-25-873254.jpg';
		this.weaponPicture = 'https://cdn3.vectorstock.com/i/thumb-large/97/02/morgenstern-medieval-weapon-or-mace-object-vector-23849702.jpg';
		this.weaponName = 'mace';

	}
}

class Archer extends Character {
	constructor() {
		super();
		this.energy = 25;
		this.health = 25;
		this.name = 'archer';
		this.picture = 'https://images-na.ssl-images-amazon.com/images/I/419BQsP3vNL._AC_.jpg';
		this.weaponPicture = 'https://i.pinimg.com/564x/3c/a6/81/3ca68126bb4c8da7bbf919aac363a7c8.jpg';
		this.weaponName = 'bow and arrow'
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
// todo: add classes (player classes)

$(()=> {

const game = new Game;

})








