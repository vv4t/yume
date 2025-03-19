"use strict";

import { loader_t } from "./loader.js";

const files = [
  [ "assets/shader.vert", "text" ],
  [ "assets/shader.frag", "text" ],
  [ "assets/test.png", "image" ]
];

const asset_library = {};

export async function load_assets() {
  const loader = new loader_t();
  const loading = [];
  
  for (const file of files) {
    const [path, type] = file;
    switch (type) {
    case "text":
      loading.push(loader.load_file(path));
      break;
    case "json":
      loading.push(loader.load_json(path));
      break;
    case "image":
      loading.push(loader.load_image(path));
      break;
    }
  }
  
  const assets = await Promise.all(loading);
  
  for (let i = 0; i < files.length; i++) {
    const [path, type] = files[i];
    asset_library[path] = assets[i];
  }
}

export function get_asset(path) {
  return asset_library[path];
}
