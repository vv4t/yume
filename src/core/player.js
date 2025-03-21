"use strict"
    
import { sprite_t } from "./sprite.js";
import { input_axis } from "./input.js";
import { vec2_t, vec3_t } from "../util/math.js";

export class player_t {
  constructor(input) {
    this.input = input;
    this.pos = new vec3_t();
    this.sprite = new sprite_t(this.pos, new vec2_t(1, 2), 0);
  }
  
  move() {
    let move = new vec3_t();
    
    if (this.input.is_axis(input_axis.UP)) move.y += 1.0;
    if (this.input.is_axis(input_axis.DOWN)) move.y -= 1.0;
    if (this.input.is_axis(input_axis.LEFT)) move.x -= 1.0;
    if (this.input.is_axis(input_axis.RIGHT)) move.x += 1.0;
    
    if (this.input.is_axis(input_axis.LEFT)) this.sprite.sprite_id = 3;
    else if (this.input.is_axis(input_axis.RIGHT)) this.sprite.sprite_id = 2;
    else if (this.input.is_axis(input_axis.UP)) this.sprite.sprite_id = 1;
    else if (this.input.is_axis(input_axis.DOWN)) this.sprite.sprite_id = 0;
    
    this.pos = this.pos.add(move.mulf(0.125));
    this.sprite.pos = this.pos;
  }
};
