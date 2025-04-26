"use strict";

import { get_asset } from "../core/assets.js";
import { path_simplify } from "../util/path.js";

export class layer_t {
  constructor(name, data) {
    this.name = name;
    this.data = data;
  }
};

export class map_t {
  constructor(name) {
    const base_dir = "assets/maps";
    const data = get_asset(`${base_dir}/${name}.tmj`);

    this.tileset = path_simplify(`${base_dir}/${data.tilesets[0].image}`);
    this.width = data.width;
    this.height = data.height;
    this.layers = [];

    for (const layer of data.layers) {
      const data = new Uint32Array(this.width * this.height);

      for (let y = 0; y < this.height; y++) {
        for (let x = 0; x < this.width; x++) {
          data[y * this.width + x] = layer.data[(this.height - y - 1) * this.width + x];
        }
      }

      if (layer.name === "collision") {
        this.collision = data;
      } else {
        this.layers.push(new layer_t(layer.name, data));
      }
    }
  }
}
