var Platformer = Platformer || {};

Platformer.Enemy = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);
    
    this.walking_speed = +properties.walking_speed;
    this.walking_distance = +properties.walking_distance;
    this.score = +properties.score;
    
    // saving previous x to keep track of walked distance
    this.previous_x = this.x;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.velocity.x = properties.direction * this.walking_speed;
    
    this.scale.setTo(-properties.direction, 1);
    
    this.anchor.setTo(0.5);
};

Platformer.Enemy.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Enemy.prototype.constructor = Platformer.Enemy;

Platformer.Enemy.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.fireballs, this.get_shoted, null, this);
    
    // change the direction if walked the maximum distance
    if (Math.abs(this.x - this.previous_x) >= this.walking_distance) {
        this.switch_direction();
    }
};

Platformer.Enemy.prototype.switch_direction = function () {
    "use strict";
    this.body.velocity.x *= -1;
    this.previous_x = this.x;
    this.scale.setTo(-this.scale.x, 1);
};

Platformer.Enemy.prototype.get_shoted = function (enemy, fireball) {
    "use strict";
    enemy.kill();
    fireball.kill();
};