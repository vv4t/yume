"use strict";

import { map_t } from "./map.js";
import { player_t } from "./player.js";

export class game_t {
  constructor(input) {
    this.input = input;
    this.sprite_array = [];
    this.map_load_listeners = [];
    this.create_player();
  }
  
  update() {
    this.player.move();
  }

  load_map(name) {
    const map = new map_t(name);
    for (const listener of this.map_load_listeners) listener(map);
  }

  add_map_load_listener(listener) {
    this.map_load_listeners.push(listener);
  }

  create_player() {
    this.player = new player_t(this.input);
    this.sprite_array.push(this.player.sprite);
  }
};
