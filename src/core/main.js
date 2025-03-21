"use strict"

import { game_t } from "./game.js";
import { input_t, input_axis } from "./input.js";
import { renderer_t } from "../renderer/renderer.js";
import { load_assets } from "../core/assets.js";

function run() {
  const input = new input_t();
  const game = new game_t(input);
  const renderer = new renderer_t(game);
  
  input.bind_key_to_axis("w", input_axis.UP);
  input.bind_key_to_axis("s", input_axis.DOWN);
  input.bind_key_to_axis("a", input_axis.LEFT);
  input.bind_key_to_axis("d", input_axis.RIGHT);

  game.load_map("untitled");

  function update() {
    game.update();
    renderer.render();
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

load_assets().then(() => run());
