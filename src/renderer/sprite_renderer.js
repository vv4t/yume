"use strict"

import { vertex_t } from "./vertex.js";
import { vec2_t, vec3_t, mat4_t } from "../util/math.js";

const MAX_TILES = 32;

export class sprite_renderer_t {
  constructor(mesh_buffer, sprite_sheet, sprite_array) {
    this.mesh_buffer = mesh_buffer;
    this.sprite_sheet = sprite_sheet;
    this.sprite_array = sprite_array;
    this.num_vertices = 0;
    this.mesh = this.mesh_buffer.allocate(6 * MAX_TILES);
  }
  
  render() {
    this.update_mesh();
    this.mesh.sub_draw(0, this.num_vertices);
  }
  
  update_mesh() {
    const vertices = [];

    for (const sprite of this.sprite_array) {
      vertices.push(...this.build_sprite(sprite.pos, sprite.size, sprite.sprite_id));
    }
    
    this.mesh_buffer.put(this.mesh, 0, vertices);
    this.num_vertices = vertices.length;
  }
  
  build_sprite(pos, size, sprite_id) {
    const vertices = [];
    
    for (let i = 0; i < size.y; i++) {
      const y = i;
      const z = i > 0 ? 1 : 0;
      const row_sprite_id = sprite_id - i * this.sprite_sheet.width;
      vertices.push(
        ...this.build_row(
          pos.add(new vec3_t(0, y, z)), size.x, row_sprite_id
        )
      );
    }
    
    return vertices;
  }
  
  build_row(pos, w, sprite_id) {
    const p1 = pos;
    const p2 = pos.add(new vec3_t(w, 1));
    
    const [uv1, uv2] = this.sprite_sheet.get_uv(sprite_id, new vec2_t(w, 1));
    
    return [
      new vertex_t(new vec3_t(p2.x, p2.y, pos.z), new vec2_t(uv2.x, uv1.y)),
      new vertex_t(new vec3_t(p2.x, p1.y, pos.z), new vec2_t(uv2.x, uv2.y)),
      new vertex_t(new vec3_t(p1.x, p2.y, pos.z), new vec2_t(uv1.x, uv1.y)),
      new vertex_t(new vec3_t(p1.x, p1.y, pos.z), new vec2_t(uv1.x, uv2.y)),
      new vertex_t(new vec3_t(p1.x, p2.y, pos.z), new vec2_t(uv1.x, uv1.y)),
      new vertex_t(new vec3_t(p2.x, p1.y, pos.z), new vec2_t(uv2.x, uv2.y))
    ];
  }
};
