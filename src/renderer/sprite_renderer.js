"use strict"

import { vertex_t } from "./vertex.js";
import { sprite_sheet_t } from "./sprite_sheet.js";
import { vec2_t, vec3_t, mat4_t } from "../util/math.js";

const MAX_TILES = 32;

export class sprite_renderer_t {
  constructor(mesh_buffer, sprite_array) {
    this.mesh_buffer = mesh_buffer;
    this.sprite_sheet = new sprite_sheet_t("assets/tilesets/sprites.png");
    this.sprite_array = sprite_array;
    this.num_vertices = 0;
    this.mesh = this.mesh_buffer.allocate(6 * MAX_TILES);
  }
  
  render() {
    this.sprite_sheet.bind();
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
    const p1 = pos;
    const p2 = pos.add(new vec3_t(size.x, size.y, 0));
    
    const [uv1, uv2] = this.sprite_sheet.get_uv(sprite_id, size);

    return [
      new vertex_t(new vec3_t(p2.x, p2.y, 0.5), new vec2_t(uv2.x, uv1.y)),
      new vertex_t(new vec3_t(p2.x, p1.y, 0.5), new vec2_t(uv2.x, uv2.y)),
      new vertex_t(new vec3_t(p1.x, p2.y, 0.5), new vec2_t(uv1.x, uv1.y)),
      new vertex_t(new vec3_t(p1.x, p1.y, 0.5), new vec2_t(uv1.x, uv2.y)),
      new vertex_t(new vec3_t(p1.x, p2.y, 0.5), new vec2_t(uv1.x, uv1.y)),
      new vertex_t(new vec3_t(p2.x, p1.y, 0.5), new vec2_t(uv2.x, uv2.y))
    ];
  }
};
