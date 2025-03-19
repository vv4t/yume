"use strict"

import { renderer_t } from "./renderer.js";

function run() {
  const renderer = new renderer_t();

  function update() {
    renderer.render();
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

load_assets().then(() => run());
