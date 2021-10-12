var Platformer = Platformer || {};

Platformer.Boss = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);
    
    this.attack_rate = +properties.attack_rate;
    this.attack_speed = +properties.attack_speed;
    this.walking_speed = +properties.walking_speed;
    this.walking_distance = +properties.walking_distance;
    
    // saving previous x to keep track of walked distance
    this.previous_x = this.x;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.velocity.x = properties.direction * this.walking_speed;
    
    this.anchor.setTo(0.5);
    
    // boss will be always attacking
    this.attack_timer = this.game_state.game.time.create();
    this.attack_timer.loop(Phaser.Timer.SECOND / this.attack_rate, this.shoot, this);
    this.attack_timer.start();
};

Platformer.Boss.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Boss.prototype.constructor = Platformer.Boss;

Platformer.Boss.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    
    // if walked the maximum distance, change the velocity, but not the scale
    if (Math.abs(this.x - this.previous_x) >= this.walking_distance) {
        this.body.velocity.x *= -1;
        this.previous_x = this.x;
    }
};

Platformer.Boss.prototype.shoot = function () {
    "use strict";
    // works the same way player shoot, but using a different pool group
    var fireball, fireball_position, fireball_properties;
    fireball = this.game_state.groups.enemy_fireballs.getFirstDead();
    fireball_position = new Phaser.Point(this.x, this.y);
    if (!fireball) {
        fireball_properties = {"texture": "fireball_image", "group": "enemy_fireballs", "direction": "LEFT", "speed": this.attack_speed};
        fireball = new Platformer.Fireball(this.game_state, fireball_position, fireball_properties);
    } else {
        fireball.reset(fireball_position.x, fireball_position.y);
        fireball.body.velocity.x = -this.attack_speed;
    }
};