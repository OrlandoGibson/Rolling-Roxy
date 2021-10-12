var Platformer = Platformer || {};

Platformer.Player = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);
    
    this.walking_speed = +properties.walking_speed;
    this.jumping_speed = +properties.jumping_speed;
    this.bouncing = +properties.bouncing;
    this.score = +localStorage.player_score || 0;
    this.lives = +localStorage.player_lives || +properties.lives;
    this.attack_rate = +properties.attack_rate;
    this.attack_speed = +properties.attack_speed;
    this.shooting = false;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.collideWorldBounds = true;
    
    this.direction = "RIGHT";
    
    this.animations.add("walking", [0, 1, 2, 1], 6, true);
    
    this.frame = 3;
    
    this.anchor.setTo(0.5);
    
    this.cursors = this.game_state.game.input.keyboard.createCursorKeys();
    
    this.shoot_timer = this.game_state.game.time.create();
    this.shoot_timer.loop(Phaser.Timer.SECOND / this.attack_rate, this.shoot, this);    
};

Platformer.Player.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Player.prototype.constructor = Platformer.Player;

Platformer.Player.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemies, this.hit_enemy, null, this);
    // the player automatically dies if in contact with invincible enemies or enemy fireballs
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.invincible_enemies, this.die, null, this);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.enemy_fireballs, this.die, null, this);
    
    if (this.cursors.right.isDown && this.body.velocity.x >= 0) {
        // move right
        this.body.velocity.x = this.walking_speed;
        this.direction = "RIGHT";
        this.animations.play("walking");
        this.scale.setTo(-1, 1);
    } else if (this.cursors.left.isDown && this.body.velocity.x <= 0) {
        // move left
        this.body.velocity.x = -this.walking_speed;
        this.direction = "LEFT";
        this.animations.play("walking");
        this.scale.setTo(1, 1);
    } else {
        // stop
        this.body.velocity.x = 0;
        this.animations.stop();
        this.frame = 3;
    }
    
    // jump only if touching a tile
    if (this.cursors.up.isDown && this.body.blocked.down) {
        this.body.velocity.y = -this.jumping_speed;
    }
    
    // dies if touches the end of the screen
    if (this.bottom >= this.game_state.game.world.height) {
        this.die();
    }
    
    // if the player is able to shoot and the shooting button is pressed, start shooting
    if (this.shooting && this.game_state.input.keyboard.isDown(Phaser.Keyboard.SPACEBAR)) {
        if (!this.shoot_timer.running) {
            this.shoot();
            this.shoot_timer.start();   
        }
    } else {
        this.shoot_timer.stop(false);
    }
};

Platformer.Player.prototype.hit_enemy = function (player, enemy) {
    "use strict";
    // if the player is above the enemy, the enemy is killed, otherwise the player dies
    if (enemy.body.touching.up) {
	s_kill.play();
        this.score += enemy.score;
        enemy.kill();
        player.y -= this.bouncing;
    } else {
        this.die();
    }
};

Platformer.Player.prototype.die = function () {
    "use strict";
    this.lives -= 1;
    this.shooting = false;
    if (this.lives > 0) {
        this.game_state.restart_level();
    } else {
        this.game_state.game_over();
    }
};

Platformer.Player.prototype.shoot = function () {
    "use strict";
    var fireball, fireball_position, fireball_properties;
    // get the first dead fireball from the pool
    fireball = this.game_state.groups.fireballs.getFirstDead();
    fireball_position = new Phaser.Point(this.x, this.y);
    if (!fireball) {
        // if there is no dead fireball, create a new one
        fireball_properties = {"texture": "fireball_image", "group": "fireballs", "direction": this.direction, "speed": this.attack_speed};
        fireball = new Platformer.Fireball(this.game_state, fireball_position, fireball_properties);
    } else {
        // if there is a dead fireball, reset it in the new position
        fireball.reset(fireball_position.x, fireball_position.y);
        fireball.body.velocity.x = (this.direction == "LEFT") ? -this.attack_speed : this.attack_speed;
    }
};
