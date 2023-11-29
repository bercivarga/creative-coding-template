// basic fragment shader for threejs in glsl language

varying vec3 vUv;

void main() {
  gl_FragColor = vec4(vUv, 1.0);
}