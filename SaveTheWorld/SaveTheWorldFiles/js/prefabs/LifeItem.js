var Platformer = Platformer || {};

Platformer.LifeItem = function (game_state, position, properties) {
    "use strict";
    Platformer.Item.call(this, game_state, position, properties);
};

Platformer.LifeItem.prototype = Object.create(Platformer.Item.prototype);
Platformer.LifeItem.prototype.constructor = Platformer.LifeItem;

Platformer.LifeItem.prototype.collect_item = function (item, player) {
    "use strict";
    s_life.play();
    Platformer.Item.prototype.collect_item.call(this);
    player.lives += 1;
};
