var Platformer = Platformer || {};

Platformer.FireballItem = function (game_state, position, properties) {
    "use strict";
    Platformer.Item.call(this, game_state, position, properties);
};

Platformer.FireballItem.prototype = Object.create(Platformer.Item.prototype);
Platformer.FireballItem.prototype.constructor = Platformer.FireballItem;

Platformer.FireballItem.prototype.collect_item = function (item, player) {
    "use strict";
    Platformer.Item.prototype.collect_item.call(this);
    player.shooting = true;
};
