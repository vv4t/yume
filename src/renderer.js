"use strict"

import { gl } from "./display.js";
import { vertex_t } from "./vertex.js";
import { camera_t } from "./camera.js";
import { texture_t } from "./texture.js";
import { get_asset } from "./assets.js";
import { mesh_buffer_t } from "./mesh.js";
import { vec2_t, vec3_t, mat4_t } from "./math.js";
import { world_shader_t } from "./world_shader.js";

export class renderer_t {
  constructor() {
    this.mesh_buffer = new mesh_buffer_t(4096);
    this.camera = new camera_t();
    this.world_shader = new world_shader_t();
    
    const vertices = [
      new vertex_t(new vec3_t(+0.5, +0.5, 0.0), new vec2_t(1,1)),
      new vertex_t(new vec3_t(+0.5, -0.5, 0.0), new vec2_t(1,0)),
      new vertex_t(new vec3_t(-0.5, +0.5, 0.0), new vec2_t(0,1)),
      
      new vertex_t(new vec3_t(-0.5, -0.5, 0.0), new vec2_t(0,0)),
      new vertex_t(new vec3_t(-0.5, +0.5, 0.0), new vec2_t(0,1)),
      new vertex_t(new vec3_t(+0.5, -0.5, 0.0), new vec2_t(1,0))
    ];
    this.mesh = this.mesh_buffer.push(vertices);
    this.texture = new texture_t(get_asset("assets/test.png"));
    
    this.world_shader.bind();
    this.mesh_buffer.bind();
    this.texture.bind();
    
    gl.clearColor(0.5, 0.7, 1.0, 1.0);
  }
  
  render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    const model = mat4_t.init_translation(new vec3_t(0.5, 0.0, 0.0));
    this.camera.update_view();
    this.world_shader.set_mvp(this.camera.get_mvp(model));
    this.mesh.draw();
  }
};
