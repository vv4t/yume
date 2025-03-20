"use strict"

import { texture_t } from "./texture.js";
import { get_asset } from "../core/assets.js";
import { vec2_t } from "../util/math.js";

export class sprite_sheet_t {
  constructor() {
    this.texture = new texture_t(get_asset("assets/tilemap.png"));
    this.tile = 32;
    this.width = this.texture.width / this.tile;
    this.height = this.texture.height / this.tile;
    this.scale = new vec2_t(this.tile / this.texture.width, this.tile / this.texture.height);
  }

  bind() {
    this.texture.bind();
  }

  get_uv(sprite_id, sprite_size=new vec2_t(1, 1)) {
    const x = sprite_id % this.width;
    const y = Math.floor(sprite_id / this.width);
    const p = new vec2_t(x, y);
    
    const uv1 = p.mul(this.scale);
    const uv2 = p.add(sprite_size).mul(this.scale);
    
    return [uv1, uv2];
  }
};
