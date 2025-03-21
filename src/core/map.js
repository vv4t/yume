"use strict";

import { get_asset } from "../core/assets.js";
import { path_simplify } from "../util/path.js";

export class map_t {
  constructor(name) {
    const base_dir = "assets/maps";
    const data = get_asset(`${base_dir}/${name}.tmj`);

    this.tileset = path_simplify(`${base_dir}/${data.tilesets[0].image}`);
    this.width = data.width;
    this.height = data.height;
    this.layers = [];

    for (const layer of data.layers) {
      if (layer.name === "collision") {
        this.collision = layer.data;
      } else {
        this.layers.push(layer.data);
      }
    }
  }
};
