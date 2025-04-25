const textArea = document.getElementById("text");

export function play_text(text) {
  console.log(text);
  const DELAY = 5;
  for (let i = 0; i < text.length; i++) {
    setTimeout(() => {
      textArea.value += text[i];
    }, (i + 1) * DELAY);
  }
}
