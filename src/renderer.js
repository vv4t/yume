"use strict"

import { gl } from "./display.js";
import { camera_t } from "./camera.js";
import { texture_t } from "./texture.js";
import { get_asset } from "./assets.js";
import { mesh_buffer_t } from "./mesh.js";
import { map_renderer_t } from "./map_renderer.js";
import { world_shader_t } from "./world_shader.js";
import { vec2_t, vec3_t, mat4_t } from "./math.js";

export class renderer_t {
  constructor(game) {
    this.game = game;
    
    this.mesh_buffer = new mesh_buffer_t(16 * 1024);
    this.camera = new camera_t();
    this.world_shader = new world_shader_t();
    this.map_renderer = new map_renderer_t(this.mesh_buffer);
    this.texture = new texture_t(get_asset("assets/test.png"));
    
    this.world_shader.bind();
    this.mesh_buffer.bind();
    this.texture.bind();
    
    gl.clearColor(0.5, 0.7, 1.0, 1.0);
  }
  
  render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    this.camera.pos = this.game.pos;
    this.camera.update_view();
    this.world_shader.set_mvp(this.camera.get_mvp(mat4_t.init_identity()));
    this.map_renderer.render();
  }
};
