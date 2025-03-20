"use strict"

import { gl } from "./display.js";
import { camera_t } from "./camera.js";
import { mesh_buffer_t } from "./mesh.js";
import { map_renderer_t } from "./map_renderer.js";
import { world_shader_t } from "./world_shader.js";
import { sprite_sheet_t } from "./sprite_sheet.js";
import { sprite_renderer_t } from "./sprite_renderer.js";
import { vec2_t, vec3_t, mat4_t } from "../util/math.js";

export class renderer_t {
  constructor(game) {
    this.game = game;
    
    this.mesh_buffer = new mesh_buffer_t(16 * 1024);
    this.camera = new camera_t();
    this.world_shader = new world_shader_t();
    this.sprite_sheet = new sprite_sheet_t("assets/tilemap.png");
    this.map_renderer = new map_renderer_t(this.mesh_buffer, this.sprite_sheet);
    this.sprite_renderer = new sprite_renderer_t(this.mesh_buffer, this.sprite_sheet, this.game.sprite_array);
    
    this.world_shader.bind();
    this.mesh_buffer.bind();
    this.sprite_sheet.bind();
    
    gl.clearColor(0.5, 0.7, 1.0, 1.0);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }
  
  render() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    this.camera.pos = this.game.pos;
    this.camera.update_view();
    this.world_shader.set_mvp(this.camera.get_mvp(mat4_t.init_identity()));
    this.map_renderer.render();
    this.sprite_renderer.render();
  }
};
