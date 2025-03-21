"use strict"
    
import { body_t } from "./body.js";
import { sprite_t } from "./sprite.js";
import { input_axis } from "./input.js";
import { vec2_t, vec3_t } from "../util/math.js";

export class player_t {
  constructor(id) {
    this.id = id;
    this.body = new body_t();
    this.sprite = new sprite_t(new vec2_t(1, 2), 0);
  }
  
  move(input) {
    let move = new vec3_t();
    
    if (input.is_axis(input_axis.UP)) move.y += 1.0;
    if (input.is_axis(input_axis.DOWN)) move.y -= 1.0;
    if (input.is_axis(input_axis.LEFT)) move.x -= 1.0;
    if (input.is_axis(input_axis.RIGHT)) move.x += 1.0;
    
    if (input.is_axis(input_axis.LEFT)) this.sprite.sprite_id = 3;
    else if (input.is_axis(input_axis.RIGHT)) this.sprite.sprite_id = 2;
    else if (input.is_axis(input_axis.UP)) this.sprite.sprite_id = 1;
    else if (input.is_axis(input_axis.DOWN)) this.sprite.sprite_id = 0;
    
    this.body.vel = move.mulf(0.125);
  }
};
