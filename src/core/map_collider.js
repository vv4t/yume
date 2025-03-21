"use strict"

import { vec3_t } from "../util/math.js";

export class map_collider_t {
  constructor(map) {
    this.width = map.width;
    this.height = map.height;
    this.collision = new Uint8Array(map.width * map.height);

    for (let i = 0; i < map.collision.length; i++) {
      this.collision[i] = map.collision[i];
    }
  }
  
  get(x, y) {
    if (x < 0 || y < 0 || x >= this.width || y >= this.height) {
      return 1;
    }

    return this.collision[x + (this.height - y - 1) * this.width];
  }

  check(x, y) {
    const x1 = Math.floor(x);
    const y1 = Math.floor(y);
    const x2 = Math.floor(x + 1);
    const y2 = Math.floor(y + 1);

    if (this.get(x1, y1)) return true;
    if (this.get(x2, y1)) return true;
    if (this.get(x1, y2)) return true;
    if (this.get(x2, y2)) return true;

    return false;
  }

  collide(body) {
    const x1 = body.pos.x;
    const y1 = body.pos.y;
    const x2 = body.pos.x + body.vel.x;
    const y2 = body.pos.y + body.vel.y;

    if (this.check(x2, y2)) {
      if (!this.check(x1, y2)) return new vec3_t(1, 0);
      else if (!this.check(x2, y1)) return new vec3_t(0, 1);
      else return new vec3_t(1, 1);
    }

    return new vec3_t(0, 0);
  }
};
