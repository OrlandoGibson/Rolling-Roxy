var Platformer = Platformer || {};

Platformer.Score = function (game_state, position, properties) {
    "use strict";
    Phaser.Text.call(this, game_state.game, position.x, position.y, properties.text);
    
    this.game_state = game_state;
    
    this.game_state.groups[properties.group].add(this);
    
    this.fixedToCamera = true;
};

Platformer.Score.prototype = Object.create(Phaser.Text.prototype);
Platformer.Score.prototype.constructor = Platformer.Score;

Platformer.Score.prototype.update = function () {
    "use strict";
    // update text to player current score
    this.text = "Score: " + this.game_state.prefabs.player.score;
};
