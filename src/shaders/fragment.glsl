// basic fragment shader for threejs in glsl language

varying vec2 vUv;

void main() {
  gl_FragColor = vec4(vUv, 0, 1.0);
}