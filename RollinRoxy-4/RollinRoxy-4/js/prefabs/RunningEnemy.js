var Platformer = Platformer || {};

Platformer.RunningEnemy = function (game_state, position, properties) {
    "use strict";
    Platformer.GroundEnemy.call(this, game_state, position, properties);
    
    this.detection_distance = +properties.detection_distance;
    this.running_speed = +properties.running_speed;
};

Platformer.RunningEnemy.prototype = Object.create(Platformer.GroundEnemy.prototype);
Platformer.RunningEnemy.prototype.constructor = Platformer.RunningEnemy;

Platformer.RunningEnemy.prototype.update = function () {
    "use strict";
    var direction;
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    
    if (this.detect_player()) {
        // player is inside detection range, run towards it
        direction = (this.game_state.prefabs.player.x < this.x) ? -1 : 1;
        this.body.velocity.x = direction * this.running_speed;
        this.scale.setTo(-direction, 1);
        this.previous_x = this.x;
    } else {
        // player is outside detection range, act like a regular enemy
        direction = (this.body.velocity.x < 0) ? -1 : 1;
        this.body.velocity.x = direction * this.walking_speed;
        this.scale.setTo(-direction, 1);
        Platformer.GroundEnemy.prototype.update.call(this);
    }
};

Platformer.RunningEnemy.prototype.detect_player = function () {
    "use strict";
    var distance_to_player;
    distance_to_player = Math.abs(this.x - this.game_state.prefabs.player.x);
    // the player must be in the same ground y position, and inside the detection range
    return (this.bottom === this.game_state.prefabs.player.bottom) && (distance_to_player <= this.detection_distance);
};
