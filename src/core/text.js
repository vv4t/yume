"use strict";

import { get_asset } from "../core/assets.js";

let history = "";

const textArea = document.getElementById("text");
textArea.value = history;

export function play_conversation(name) {
  const text = get_asset(`assets/data/${name}.txt`);
  submit_text(text);
}

export function submit_text(text) {
  history += text;
  play_text(text, 10);
}

function show_log(entry) {
  if (entry > 0) {
    clear_text();
    play_text(get_asset(`assets/data/LOG${entry}.txt`), 5);
  } else {
    textArea.value = history;
  }
}

function clear_text() {
  textArea.value = "";
}

function get_log_buttons() {
  const log_buttons = [document.getElementById("log_main")];

  for (let i = 1; true; i++) {
    const log_button = document.getElementById(`log_${i}`);
    if (!log_button) break;
    log_buttons.push(log_button);
  }

  return log_buttons;
}

function lock_text() {
  get_log_buttons().forEach((button) => {
    button.style.color = "#559955";
    button.disabled = true;
  });
}

function unlock_text() {
  get_log_buttons().forEach((button) => {
    button.style.color = "#aaffaa";
    button.disabled = false;
  });
}

function play_text(text, delay) {
  lock_text();

  text = text.split("\n\n").map((chunk) => chunk.replace(/\n/g, " ")).join("\n\n");
  
  for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
      textArea.value += text[i];
      textArea.scrollTop = textArea.scrollHeight;
    }, (i + 1) * delay);
  }

  setTimeout(() => unlock_text(), (text.length + 1) * delay);
}

get_log_buttons().forEach((button, i) => {
  button.addEventListener("click", () => show_log(i));
});
