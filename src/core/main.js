"use strict"

import { map_t } from "./map.js";
import { game_t } from "./game.js";
import { input_t, input_axis } from "./input.js";
import { play_text } from "./text.js";
import { load_assets } from "./assets.js";
import { renderer_t } from "../renderer/renderer.js";

function run() {
  const input = new input_t();
  const game = new game_t(input);
  const renderer = new renderer_t(game);
  
  input.bind_key_to_axis("w", input_axis.UP);
  input.bind_key_to_axis("s", input_axis.DOWN);
  input.bind_key_to_axis("a", input_axis.LEFT);
  input.bind_key_to_axis("d", input_axis.RIGHT);
  
  const map = new map_t("desert");

  game.load_map(map);
  renderer.load_map(map);

  function update() {
    game.update();
    renderer.render();
    requestAnimationFrame(update);
  }

  requestAnimationFrame(update);
}

load_assets().then(() => run());

play_text("Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.");
