"use strict";

import { player_t } from "./player.js";

export class game_t {
  constructor(input) {
    this.input = input;
    this.sprite_array = [];
    
    this.player = new player_t(this.input);
    this.sprite_array.push(this.player.sprite);
  }
  
  update() {
    this.player.move();
  }
};
