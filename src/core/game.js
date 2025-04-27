"use strict";

import { map_collider_t } from "./map_collider.js";
import { player_t } from "./player.js";
import { body_t } from "./body.js";
import { sprite_t } from "./sprite.js";
import { vec2_t, vec3_t } from "../util/math.js";
import { play_conversation} from "./text.js";


export class game_t {
  constructor(bus, input) {
    this.input = input;
    this.bus = bus;
    this.entity_id = 0;
    this.c_body = {};
    this.c_sprite = {};
    this.create_player();
  
    // desert level idk where to put this
    this.swarms = []
    this.has_played_desert_cutscene = false;
  }
  
  update() {
    this.player.move(this.input);
    this.body_collide();
    this.body_integrate();
    this.sprite_animate();
  }

  load_map(map) {
    this.map_collider = new map_collider_t(map);
    this.player.spawn(new vec3_t());

    for (const spawn of map.spawns) {
      if (spawn.name === "player") {
        this.player.spawn(spawn.pos);
      }
      if (spawn.name === "swarm") {
        const swarmBody = new body_t();
        swarmBody.pos = spawn.pos

        const swarmSprite = new sprite_t(new vec2_t(1,1), 140);
        swarmSprite.animate(140, 4, 0.1)

        const swarm = this.add_entity();
        this.c_body[swarm] = swarmBody;
        this.c_sprite[swarm] = swarmSprite;
        this.swarms.push(swarm);
      }
    }
  }

  play_desert_cutscene() {
    if (this.has_played_desert_cutscene) {
      return;
    }

    const target_loc = new vec3_t(17.25, 17.25, 0.0); 
    this.has_played_desert_cutscene = true;
    for (const swarm of this.swarms) {  
      const moveInterval = setInterval(() => {
        const current_pos = this.c_body[swarm].pos;
        const delta = target_loc.add(current_pos.mulf(-1)).mulf(0.25);      

        this.c_body[swarm].pos = current_pos.add(delta)

        const dist = this.c_body[swarm].pos.add(target_loc.mulf(-1));
        if (dist.x <= 0.1 && dist.y <= 0.1) {
          clearInterval(moveInterval)
          this.c_body[swarm].pos = new vec3_t(0.0, 0.0, 0.0);
          this.swarms.splice(this.swarms.indexOf(swarm), 1);
        }
      }, 
      100)
    }

    const spawnInterval = setInterval(() => {
      console.log(this.swarms);
      if (this.swarms.length == 0) {
        console.log("XD")
        const swarmBody = new body_t();
        swarmBody.pos = target_loc;

        const swarmSprite = new sprite_t(new vec2_t(2,2), 112);
        swarmSprite.animate(112, 7, 0.1)
        setTimeout(() => {
          swarmSprite.animate(6 , 1, 0.1)
          swarmSprite.stop()
          setTimeout(() => play_conversation("SWARM"), 200);
        }, 1000)

        const swarm = this.add_entity();
        this.c_body[swarm] = swarmBody;
        this.c_sprite[swarm] = swarmSprite;

        clearInterval(spawnInterval);
      }
    }, 
    100)
  }

  sprite_animate() {
    for (const entity in this.c_sprite) {
      const sprite = this.c_sprite[entity];
      if (sprite.frame_count > 0) {
        sprite.frame_time += sprite.frame_delta;
        sprite.sprite_id = sprite.frame_start + (Math.floor(sprite.frame_time) % (sprite.frame_count)) * sprite.size.x;
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
