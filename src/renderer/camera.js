"use strict";

import { vec2_t, vec3_t, mat4_t } from "../util/math.js";

export class camera_t {
  constructor() {
    this.pos = new vec3_t();
    this.p = mat4_t.init_orthogonal(-9.5, 10.5, 8.0, -7.0, -10.0, 10.0);
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
