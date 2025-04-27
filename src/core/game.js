"use strict";

import { map_collider_t } from "./map_collider.js";
import { player_t } from "./player.js";
import { machiner_t } from "./machiner.js";
import { swarm_t } from "./swarm.js";
import { body_t } from "./body.js";
import { sprite_t } from "./sprite.js";
import { vec2_t, vec3_t } from "../util/math.js";
import { submit_text, play_conversation, make_log_available } from "./text.js";


export class game_t {
  constructor(bus, input) {
    this.input = input;
    this.bus = bus;
    this.flags = {};

    this.reset_entities();
  }
  
  update() {
    this.player.move(this.input);
    this.body_collide();
    this.body_integrate();
    this.sprite_animate();
    this.swarm_update();
  }

  reset_entities() {
    this.entity_id = 0;
    this.c_body = {};
    this.c_sprite = {};
    this.create_player();
    this.swarm = [];
    this.swarm_target = null;
    this.machiner = null;
  }

  load_map(map) {
    this.reset_entities();
    this.map_collider = new map_collider_t(map);
    this.player.spawn(new vec3_t());

    for (const spawn of map.spawns) {
      if (spawn.name === "player") this.player.spawn(spawn.pos);
      if (spawn.name === "swarm") this.add_swarm(spawn.pos);
      if (spawn.name === "swarm_target") this.swarm_target = spawn.pos;
      if (spawn.name === "machiner") this.add_machiner(spawn.pos);
    }
  }

  delete_entity(id) {
    delete this.c_body[id];
    delete this.c_sprite[id];
  }

  swarm_update() {
    if (!("swarm_should_move_to_target" in this.flags)) return;
    if ("swarm_has_combined" in this.flags) return;

    if (this.swarm.length === 0) {
      this.show_swarm_combined(this.swarm_target);
      this.flags["swarm_has_combined"] = true;
    } else {
      for (const swarm of this.swarm) {
        if (swarm.move_to_target(this.swarm_target)) {
          this.delete_entity(swarm.id);
          this.swarm.splice(this.swarm.indexOf(swarm), 1);
        }
      }
    }
  }

  add_swarm(pos) {
    const id = this.add_entity();
    const swarm = new swarm_t(id, pos);
    this.c_body[id] = swarm.body;
    this.c_sprite[id] = swarm.sprite;
    this.swarm.push(swarm);
  }

  add_machiner(pos) {
    const id = this.add_entity();
    const machiner = new machiner_t(id, pos);
    this.c_body[id] = machiner.body;
    this.c_sprite[id] = machiner.sprite;
    this.machiner = machiner;
  }

  show_swarm_combined(pos) {
    const body = new body_t();
    const sprite = new sprite_t(new vec2_t(2, 2), 112);

    const id = this.add_entity();
    const swarm = new swarm_t(id, pos);
    this.c_body[id] = body;
    this.c_sprite[id] = sprite;

    body.pos = pos;

    sprite.animate(112, 7, 0.1);

    setTimeout(() => {
      sprite.animate(6, 1, 0.1)
      sprite.stop();      
    }, 1000);

    setTimeout(() => {
      play_conversation("SWARM", () => {
        sprite.animate(154, 7, 0.1);
        setTimeout(() => {
          this.player.start();
          sprite.stop();
          this.delete_entity(id);
          make_log_available(3);
          submit_text("-- Entry for LOG 3 saved, The Amalgamate Creature\n\n --");
        }, 1000);
      });
    }, 1200);
  }

  play_desert_cutscene() {
    if ("desert_cutscene_has_played" in this.flags) return;

    this.player.stop();
    
    this.flags["desert_cutscene_has_played"] = true;
    this.flags["swarm_should_move_to_target"] = true;
  }

  play_final_chamber_cutscene() {
    if ("final_chamber_cutscene_has_played" in this.flags) return;

    this.player.stop();
    this.machiner.sprite.animate(11, 1, 1.0);
    play_conversation("MACHINER", () => {
      this.machiner.sprite.animate(31, 1, 1.0);
      make_log_available(5);
      submit_text("-- Entry for LOG 5 saved, The Machine People\n\n --");

      const moveInterval = setInterval(() => {
        if (this.machiner.move_to_target(new vec3_t(15, 4, 0))) clearInterval(moveInterval);
      }, 100);

      setTimeout(() => {
        this.player.sprite.animate(145, 3, 0.1);
      }, 2000);
      setTimeout(() => {
        this.player.sprite.animate(147, 2, 0.1);
      }, 2500);
    });
    this.flags["final_chamber_cutscene_has_played"] = true;
  }

  sprite_animate() {
    for (const entity in this.c_sprite) {
      const sprite = this.c_sprite[entity];
      if (sprite.frame_count > 0) {
        sprite.frame_time += sprite.frame_delta;
        sprite.sprite_id = sprite.frame_start + (Math.floor(sprite.frame_time) % sprite.frame_count) * sprite.size.x;
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
