var Platformer = Platformer || {};

Platformer.Fireball = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);
    
    this.direction = properties.direction;
    this.speed = +properties.speed;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.allowGravity = false;
    // velocity is constant, but defined by direction
    if (this.direction == "LEFT") {
        this.body.velocity.x = -this.speed;
    } else {
        this.body.velocity.x = this.speed;
    }
    
    this.anchor.setTo(0.5);
    // Fireball uses the same asset as FireballItem, so we make it a little smaller
    this.scale.setTo(0.75);
};

Platformer.Fireball.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Fireball.prototype.constructor = Platformer.Fireball;

Platformer.Fireball.prototype.update = function () {
    "use strict";
    // the fireball is destroyed if in contact with anything else
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision, this.kill, null, this);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.layers.invincible_enemies, this.kill, null, this);
};
