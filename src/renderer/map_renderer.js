"use strict";

import { vertex_t } from "./vertex.js";
import { vec2_t, vec3_t, mat4_t } from "./math.js";

export class map_renderer_t {
  constructor(mesh_buffer, sprite_sheet) {
    this.mesh_buffer = mesh_buffer;
    this.sprite_sheet = sprite_sheet;
    this.mesh = this.mesh_buffer.push(this.build_chunk(0, 0));
  }
  
  render() {
    this.mesh.draw();
  }
  
  build_chunk(x, y) {
    const vertices = [];
    
    for (let i = 0; i < 32; i++) {
      for (let j = 0; j < 32; j++) {
        vertices.push(...this.build_tile(x + i, y + j));
      }
    }
    
    return vertices;
  }
  
  build_tile(x, y) {
    const x1 = x;
    const x2 = x + 1;
    const y1 = y;
    const y2 = y + 1;
    
    const [uv1,uv2] = this.sprite_sheet.get_uv(0);

    return [
      new vertex_t(new vec3_t(x2, y2, 0.0), new vec2_t(uv2.x, uv1.y)),
      new vertex_t(new vec3_t(x2, y1, 0.0), new vec2_t(uv2.x, uv2.y)),
      new vertex_t(new vec3_t(x1, y2, 0.0), new vec2_t(uv1.x, uv1.y)),
      new vertex_t(new vec3_t(x1, y1, 0.0), new vec2_t(uv1.x, uv2.y)),
      new vertex_t(new vec3_t(x1, y2, 0.0), new vec2_t(uv1.x, uv1.y)),
      new vertex_t(new vec3_t(x2, y1, 0.0), new vec2_t(uv2.x, uv2.y))
    ];
  }
};
