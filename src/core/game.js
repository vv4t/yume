"use strict";

import { vec2_t, vec3_t } from "../util/math.js";
import { input_axis } from "./input.js";
import { sprite_t } from "./sprite.js";

export class game_t {
  constructor(input) {
    this.input = input;
    this.sprite_array = [];
    this.pos = new vec3_t();
    
    this.player_sprite = this.add_sprite(16);
    this.player_sprite.size = new vec2_t(1,2);
  }
  
  update() {
    let move = new vec3_t();
    
    if (this.input.is_axis(input_axis.UP)) move.y += 1.0;
    if (this.input.is_axis(input_axis.DOWN)) move.y -= 1.0;
    if (this.input.is_axis(input_axis.LEFT)) move.x -= 1.0;
    if (this.input.is_axis(input_axis.RIGHT)) move.x += 1.0;
    
    if (this.input.is_axis(input_axis.LEFT)) this.player_sprite.sprite_id = 19;
    else if (this.input.is_axis(input_axis.RIGHT)) this.player_sprite.sprite_id = 18;
    else if (this.input.is_axis(input_axis.UP)) this.player_sprite.sprite_id = 17;
    else if (this.input.is_axis(input_axis.DOWN)) this.player_sprite.sprite_id = 16;
    
    this.pos = this.pos.add(move.mulf(0.125));
    this.player_sprite.pos = this.pos;
  }
  
  add_sprite(sprite_id) {
    const sprite = new sprite_t(new vec3_t(), new vec2_t(1, 1), sprite_id);
    this.sprite_array.push(sprite);
    return sprite;
  }
};
