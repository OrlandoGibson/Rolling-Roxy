var Platformer = Platformer || {};

Platformer.Item = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);
    
    this.game_state.game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.allowGravity = false;
    
    this.anchor.setTo(0.5);
};

Platformer.Item.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Item.prototype.constructor = Platformer.Item;

Platformer.Item.prototype.update = function () {
    "use strict";
    this.game_state.game.physics.arcade.collide(this, this.game_state.layers.collision);
    this.game_state.game.physics.arcade.overlap(this, this.game_state.groups.players, this.collect_item, null, this);
};

Platformer.Item.prototype.collect_item = function () {
    "use strict";
    // by default, the item is destroyed when collected
    this.kill();
};
