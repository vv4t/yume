#version 300 es

precision mediump float;

in vec2 vs_uv;
out vec4 frag_color;

void main() {
  frag_color = vec4(vs_uv, 0.0, 1.0);
}
