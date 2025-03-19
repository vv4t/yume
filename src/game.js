"use strict";

import { vec3_t } from "./math.js";
import { input_axis } from "./input.js";

export class game_t {
  constructor(input) {
    this.input = input;
    this.pos = new vec3_t();
  }
  
  update() {
    let move = new vec3_t();
    
    if (this.input.is_axis(input_axis.UP)) move.y += 1.0;
    if (this.input.is_axis(input_axis.DOWN)) move.y -= 1.0;
    if (this.input.is_axis(input_axis.LEFT)) move.x -= 1.0;
    if (this.input.is_axis(input_axis.RIGHT)) move.x += 1.0;
    
    if (move.x && move.y) move = move.mulf(1.0 / Math.sqrt(2));
    
    this.pos = this.pos.add(move.mulf(0.1));
  }
};
