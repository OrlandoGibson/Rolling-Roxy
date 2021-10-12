var Platformer = Platformer || {};

Platformer.Coin = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);
    
    this.score = +properties.score;
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    
    this.anchor.setTo(0.5);
};

Platformer.Coin.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Coin.prototype.constructor = Platformer.Coin;

Platformer.Coin.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.collect_coin, null, this);
};

Platformer.Coin.prototype.collect_coin = function (coin, player) {
    "use strict";
    s_coin.play();
    // kill coin and increase score
    this.kill();
    player.score += this.score;
};

