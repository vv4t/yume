"use strict"

import { renderer_t } from "./renderer.js";
import { load_assets } from "./assets.js";

function run() {
  const renderer = new renderer_t();

  function update() {
    renderer.render();
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

load_assets().then(() => run());
