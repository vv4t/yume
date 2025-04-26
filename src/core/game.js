"use strict";

import { map_collider_t } from "./map_collider.js";
import { player_t } from "./player.js";
import { vec3_t } from "../util/math.js";

export class game_t {
  constructor(bus, input) {
    this.input = input;
    this.bus = bus;
    this.entity_id = 0;
    this.c_body = {};
    this.c_sprite = {};
    this.create_player();
  }
  
  update() {
    this.player.move(this.input);
    this.body_collide();
    this.body_integrate();
  }

  load_map(map) {
    this.map_collider = new map_collider_t(map);
    this.player.spawn(new vec3_t());

    for (const spawn of map.spawns) {
      if (spawn.name === "player") {
        this.player.spawn(spawn.pos);
      }
    }
  }

  body_collide() {
    if (!this.map_collider) return;

    const triggers = this.map_collider.check_trigger(this.player.body);
    this.bus.raise_events(triggers);

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
};
