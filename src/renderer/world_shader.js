"use strict";

import { gl } from "./display.js";
import { get_asset } from "./assets.js";
import { shader_t } from "./shader.js";

export class world_shader_t {
  constructor() {
    const src_vertex = get_asset("assets/shader.vert");
    const src_fragment = get_asset("assets/shader.frag");
    this.shader = new shader_t(src_vertex, src_fragment);
    this.ul_mvp = this.shader.get_uniform_location("u_mvp");
  }
  
  bind() {
    this.shader.bind();
  }
  
  set_mvp(mvp) {
    gl.uniformMatrix4fv(this.ul_mvp, gl.FALSE, mvp.m);
  }
};
