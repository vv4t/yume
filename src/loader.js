"use strict";

const root_dir = window.location;

export async function load_file(path, on_loaded) {
  const xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function() {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        on_loaded(xhr.responseText);
      } else {
        throw "could not load file '" + path + "'";
      }
    }
  };
  
  xhr.open("GET", root_dir + path);
  xhr.send();
}

export async function load_json(path, on_loaded) {
  load_file(path, (file) => {
    on_loaded(JSON.parse(file));
  });
}

export async function load_image(path, on_loaded) {
  const image = new Image();
  image.onload = function() {
    on_loaded(image);
  };
  
  image.src = root_dir + path;
}
