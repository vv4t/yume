"use strict";

import { map_t } from "./map.js";
import { map_collider_t } from "./map_collider.js";
import { player_t } from "./player.js";

export class game_t {
  constructor(input) {
    this.input = input;
    this.entity_id = 0;
    this.c_body = {};
    this.c_sprite = {};
    this.map_load_listeners = [];
    this.create_player();
  }
  
  update() {
    this.player.move(this.input);
    this.body_collide();
    this.body_integrate();
  }

  load_map(name) {
    const map = new map_t(name);
    this.map_collider = new map_collider_t(map);
    for (const listener of this.map_load_listeners) listener(map);
  }

  body_collide() {
    if (!this.map_collider) return;

    for (const entity in this.c_body) {
      const body = this.c_body[entity];
      const collision = this.map_collider.collide(body);

      if (collision.x) body.vel.x = 0.0;
      if (collision.y) body.vel.y = 0.0;
    }
  }

  body_integrate() {
    for (const entity in this.c_body) {
      const body = this.c_body[entity];
      body.pos = body.pos.add(body.vel);
    }
  }

  create_player() {
    const id = this.add_entity();
    this.player = new player_t(id);
    this.c_body[id] = this.player.body;
    this.c_sprite[id] = this.player.sprite;
  }

  add_entity() {
    return this.entity_id++;
  }

  add_map_load_listener(listener) {
    this.map_load_listeners.push(listener);
  }
};
