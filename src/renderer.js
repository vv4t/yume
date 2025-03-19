"use strict"

import { gl } from "./display.js";
import { shader_t } from "./shader.js";
import { mesh_buffer_t } from "./mesh.js";
import { vertex_t } from "./vertex.js";
import { vec2_t, vec3_t, mat4_t } from "./math.js";
import { get_asset } from "./assets.js";

export class renderer_t {
  constructor() {
    this.mesh_buffer = new mesh_buffer_t(4096);
    this.mesh_buffer.bind();
    
    const src_vertex = get_asset("shader.vert");
    const src_fragment = get_asset("shader.frag");
    
    this.shader = new shader_t(src_vertex, src_fragment);
    this.shader.bind();
    this.ul_mvp = this.shader.get_uniform_location("u_mvp");
    
    const mvp = mat4_t.init_rotation(0.5).mul(mat4_t.init_translation(new vec3_t(0.5, 0.0, 0.0)));
    
    gl.uniformMatrix4fv(this.ul_mvp, gl.FALSE, mvp.m);
    
    const vertices = [
      new vertex_t(new vec3_t(+0.5, +0.5, 0.0), new vec2_t(1,1)),
      new vertex_t(new vec3_t(+0.5, -0.5, 0.0), new vec2_t(1,0)),
      new vertex_t(new vec3_t(-0.5, +0.5, 0.0), new vec2_t(0,1)),
      
      new vertex_t(new vec3_t(-0.5, -0.5, 0.0), new vec2_t(0,0)),
      new vertex_t(new vec3_t(-0.5, +0.5, 0.0), new vec2_t(0,1)),
      new vertex_t(new vec3_t(+0.5, -0.5, 0.0), new vec2_t(1,0))
    ];
    
    this.mesh = this.mesh_buffer.push(vertices);
    this.texture = new texture_t(get_asset("image.png"));
    
    gl.clearColor(0.5, 0.7, 1.0, 1.0);
  }
  
  render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.mesh.draw();
  }
};
