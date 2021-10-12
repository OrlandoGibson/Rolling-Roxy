var Platformer = Platformer || {};

Platformer.Lives = function (game_state, position, properties) {
    "use strict";
    Platformer.Prefab.call(this, game_state, position, properties);
    
    this.frame = +properties.frame;
    this.visible = false;
    
    this.spacing = +properties.spacing;
    
    this.fixedToCamera = true;
    // saving initial position if it gets changed by window scaling
    this.initial_position = new Phaser.Point(this.x, this.y);
    
    this.lives = [];
    this.dead_life = null;
    this.create_lives();
};

Platformer.Lives.prototype = Object.create(Platformer.Prefab.prototype);
Platformer.Lives.prototype.constructor = Platformer.Lives;

Platformer.Lives.prototype.update = function () {
    "use strict";
    // update to show current number of lives
    if (this.game_state.prefabs.player.lives !== this.lives.length) {
        this.update_lives();
    }
};

Platformer.Lives.prototype.create_lives = function () {
    "use strict";
    var life_index, life_position, life;
    // create a sprite for each one of the player lives
    for (life_index = 0; life_index < this.game_state.prefabs.player.lives; life_index += 1) {
        life_position = new Phaser.Point(this.initial_position.x + (life_index * (this.width + this.spacing)), this.initial_position.y);
        life = new Phaser.Sprite(this.game_state.game, life_position.x, life_position.y, this.texture, this.frame);
        life.fixedToCamera = true;
        this.game_state.groups.hud.add(life);
        this.lives.push(life);
    }
};

Platformer.Lives.prototype.update_lives = function () {
    "use strict";
    var life, life_position;
    life = this.lives[this.lives.length - 1];
    if (this.game_state.prefabs.player.lives < this.lives.length) {
        // the player died, so we have to kill the last life
        life.kill();
        this.dead_life = life;
        this.lives.pop();
    } else {
        // the player received another life
        if (!this.dead_life) {
            // if there is no dead life we can reuse, we create a new one
            life_position = new Phaser.Point(this.initial_position.x + (this.lives.length * (this.width + this.spacing)), this.initial_position.y);
            life = new Phaser.Sprite(this.game_state.game, life_position.x, life_position.y, this.texture, this.frame);
            life.fixedToCamera = true;
            this.game_state.groups.hud.add(life);
        } else {
            // if there is a dead life, we just reset it
            life = this.dead_life;
            life_position = new Phaser.Point(this.initial_position.x + ((this.lives.length - 1) * (this.width + this.spacing)), this.initial_position.y);
            life.reset(life_position.x, life_position.y);
            this.dead_life = null;
        }
        this.lives.push(life);
    }
};
