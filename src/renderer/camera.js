"use strict";

import { vec2_t, vec3_t, mat4_t } from "./math.js";

export class camera_t {
  constructor() {
    this.pos = new vec3_t();
    this.p = mat4_t.init_orthogonal(-10, 10, 7.5, -7.5, -5.0, 5.0);
    this.update_view();
  }
  
  translate(v) {
    this.pos = this.pos.add(v);
  }
  
  update_view() {
    this.v = mat4_t.init_translation(this.pos.mulf(-1));
    this.vp = this.v.mul(this.p);
  }
  
  get_mvp(model) {
    return model.mul(this.vp);
  }
};
