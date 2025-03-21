"use strict";

import { vertex_t } from "./vertex.js";
import { sprite_sheet_t } from "./sprite_sheet.js";
import { vec2_t, vec3_t, mat4_t } from "../util/math.js";

export class map_renderer_t {
  constructor(mesh_buffer, map) {
    this.mesh_buffer = mesh_buffer;
    this.sprite_sheet = new sprite_sheet_t(map.tileset, 32);
    this.mesh = this.mesh_buffer.push(this.build_map(map));
  }
  
  render() {
    this.sprite_sheet.bind();
    this.mesh.draw();
  }
  
  build_map(map) {
    const vertices = [];

    for (let z = 0; z < map.layers.length; z++) {
      const layer = map.layers[z];

      for (let i = 0; i < map.height; i++) {
        for (let j = 0; j < map.width; j++) {
          const sprite_id = layer[i * map.width + j];
          if (sprite_id !== 0) vertices.push(...this.build_tile(j, map.height - i - 1, z, sprite_id - 1));
        }
      }
    }
    
    return vertices;
  }
  
  build_tile(x, y, z, sprite_id) {
    const x1 = x;
    const x2 = x + 1;
    const y1 = y;
    const y2 = y + 1;
    
    const [uv1,uv2] = this.sprite_sheet.get_uv(sprite_id);

    return [
      new vertex_t(new vec3_t(x2, y2, z), new vec2_t(uv2.x, uv1.y)),
      new vertex_t(new vec3_t(x2, y1, z), new vec2_t(uv2.x, uv2.y)),
      new vertex_t(new vec3_t(x1, y2, z), new vec2_t(uv1.x, uv1.y)),
      new vertex_t(new vec3_t(x1, y1, z), new vec2_t(uv1.x, uv2.y)),
      new vertex_t(new vec3_t(x1, y2, z), new vec2_t(uv1.x, uv1.y)),
      new vertex_t(new vec3_t(x2, y1, z), new vec2_t(uv2.x, uv2.y))
    ];
  }
};
