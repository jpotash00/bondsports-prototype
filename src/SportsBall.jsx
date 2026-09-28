import { useEffect, useRef, useState } from 'react';

// Every ball is ray-traced in one fragment shader: a unit sphere (or a cylinder for the puck),
// rotated by uRot, coloured by a procedural surface function and lit with one key light.
const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform mat3 uRot;
uniform float uType;
uniform float uScale;

const float TAU = 6.2831853;

float hash(vec3 p) { p = fract(p * 0.3183099 + 0.1); p *= 17.0; return fract(p.x * p.y * p.z * (p.x + p.y + p.z)); }
float noise(vec3 x) {
  vec3 i = floor(x), f = fract(x);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(mix(hash(i), hash(i + vec3(1,0,0)), f.x), mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
             mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x), mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
}

// The baseball / tennis seam: a curve that lies exactly on the unit sphere (a + b = 1).
vec3 seamPt(float t) {
  const float a = 0.72, b = 0.28;
  return vec3(a * cos(t) + b * cos(3.0 * t), a * sin(t) - b * sin(3.0 * t), 2.0 * sqrt(a * b) * sin(2.0 * t));
}
vec2 seamDist(vec3 q) {
  float best = 10.0, bt = 0.0;
  for (int i = 0; i < 72; i++) {
    float t = float(i) / 72.0 * TAU;
    float d = distance(q, seamPt(t));
    if (d < best) { best = d; bt = t; }
  }
  float base = bt;
  for (int i = -4; i <= 4; i++) {
    float t = base + float(i) * TAU / 288.0;
    float d = distance(q, seamPt(t));
    if (d < best) { best = d; bt = t; }
  }
  return vec2(best, bt);
}

vec3 baseball(vec3 q) {
  vec3 c = vec3(0.97, 0.95, 0.9) * (0.92 + 0.08 * noise(q * 38.0));
  vec2 s = seamDist(q);
  c *= mix(0.72, 1.0, smoothstep(0.0, 0.03, s.x));
  vec3 p = seamPt(s.y);
  vec3 tng = normalize(seamPt(s.y + 0.01) - p);
  float side = abs(dot(cross(tng, p), q - p));
  float along = s.y / TAU * 46.0;
  float slant = fract(along + (side - 0.03) * 5.0);
  float stitch = (1.0 - smoothstep(0.24, 0.34, abs(slant - 0.5) * 2.0 - 0.3))
               * smoothstep(0.02, 0.035, s.x) * (1.0 - smoothstep(0.11, 0.13, s.x));
  return mix(c, vec3(0.8, 0.13, 0.12), stitch);
}

vec3 basketball(vec3 q) {
  vec3 c = vec3(0.88, 0.42, 0.14) * (0.8 + 0.3 * noise(q * 60.0));
  float d = min(min(abs(q.x), abs(q.y)), abs(abs(q.z) - 0.64));
  return mix(vec3(0.09, 0.05, 0.03), c, smoothstep(0.022, 0.038, d));
}

void soccerTest(vec3 q, vec3 c, float weight, float isPent, inout float d1, inout float d2, inout float pent) {
  float d = dot(q, normalize(c)) / weight;
  if (d > d1) { d2 = d1; d1 = d; pent = isPent; } else if (d > d2) { d2 = d; }
}
vec3 soccer(vec3 q) {
  const float phi = 1.618034;
  float d1 = -9.0, d2 = -9.0, pent = 0.0;
  for (int k = 0; k < 3; k++) {
    for (int i = 0; i < 4; i++) {
      float s1 = mod(float(i), 2.0) < 0.5 ? 1.0 : -1.0;
      float s2 = i < 2 ? 1.0 : -1.0;
      vec3 a = vec3(0.0, s1, s2 * phi);
      vec3 b = vec3(0.0, s1 * phi, s2 / phi);
      if (k == 1) { a = a.zxy; b = b.zxy; }
      if (k == 2) { a = a.yzx; b = b.yzx; }
      soccerTest(q, a, 1.0265, 1.0, d1, d2, pent); // pentagons sit slightly further out
      soccerTest(q, b, 1.0, 0.0, d1, d2, pent);
    }
  }
  for (int i = 0; i < 8; i++) {
    vec3 c = vec3(mod(float(i), 2.0) < 0.5 ? 1.0 : -1.0, mod(floor(float(i) / 2.0), 2.0) < 0.5 ? 1.0 : -1.0, i < 4 ? 1.0 : -1.0);
    soccerTest(q, c, 1.0, 0.0, d1, d2, pent);
  }
  vec3 c = pent > 0.5 ? vec3(0.07, 0.08, 0.1) : vec3(0.97) * (0.95 + 0.05 * noise(q * 30.0));
  return c * mix(0.35, 1.0, smoothstep(0.003, 0.011, d1 - d2));
}

vec3 volleyball(vec3 q) {
  vec3 a = abs(q);
  float m = max(a.x, max(a.y, a.z));
  float u, face;
  if (m == a.x) { u = q.y / m; face = 0.0; } else if (m == a.y) { u = q.z / m; face = 1.0; } else { u = q.x / m; face = 2.0; }
  float strip = u < -0.34 ? 0.0 : (u > 0.34 ? 2.0 : 1.0);
  vec3 c = mod(strip + face, 2.0) < 0.5 ? vec3(0.99, 0.8, 0.16) : vec3(0.1, 0.28, 0.66);
  float mid = a.x + a.y + a.z - m - min(a.x, min(a.y, a.z));
  float seam = min(abs(abs(u) - 0.34) * 0.8, m - mid);
  return c * mix(0.4, 1.0, smoothstep(0.012, 0.03, seam)) * (0.95 + 0.05 * noise(q * 30.0));
}

vec3 tennis(vec3 q) {
  vec2 s = seamDist(q);
  vec3 felt = vec3(0.82, 0.9, 0.22) * (0.78 + 0.3 * noise(q * 90.0));
  return mix(vec3(0.97, 0.97, 0.93), felt, smoothstep(0.045, 0.06, s.x));
}

vec3 shade(vec3 c, vec3 n, float ks, float sh, float rim) {
  vec3 L = normalize(vec3(-0.5, 0.7, 0.75));
  float dif = max(dot(n, L), 0.0);
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), sh) * ks;
  float ao = 0.5 + 0.5 * n.z;
  return c * (0.3 * ao + 0.82 * dif) + spec + rim * pow(1.0 - n.z, 3.0);
}

vec4 puck(vec2 uv, float aa) {
  vec4 acc = vec4(0.0);
  for (int s = 0; s < 4; s++) {
    vec2 p = uv + (vec2(mod(float(s), 2.0), floor(float(s) / 2.0)) - 0.5) * aa * 0.5;
    vec3 ro = uRot * vec3(p, 3.0);
    vec3 rd = uRot * vec3(0.0, 0.0, -1.0);
    const float R = 0.93, H = 0.3;
    float tHit = 1e9, cap = 0.0;
    vec3 nO = vec3(0.0);
    float A = dot(rd.xz, rd.xz), B = dot(ro.xz, rd.xz), C = dot(ro.xz, ro.xz) - R * R;
    float disc = B * B - A * C;
    if (A > 1e-5 && disc >= 0.0) {
      float t = (-B - sqrt(disc)) / A;
      vec3 h = ro + t * rd;
      if (t > 0.0 && abs(h.y) <= H) { tHit = t; nO = vec3(h.x, 0.0, h.z) / R; }
    }
    if (abs(rd.y) > 1e-5) {
      for (int k = 0; k < 2; k++) {
        float sy = k == 0 ? 1.0 : -1.0;
        float t = (sy * H - ro.y) / rd.y;
        vec3 h = ro + t * rd;
        if (t > 0.0 && t < tHit && dot(h.xz, h.xz) <= R * R) { tHit = t; nO = vec3(0.0, sy, 0.0); cap = 1.0; }
      }
    }
    if (tHit < 1e8) {
      vec3 h = ro + tHit * rd;
      vec3 n = nO * uRot;
      vec3 base = vec3(0.07, 0.075, 0.085);
      if (cap < 0.5) {
        float ang = atan(h.z, h.x) / TAU * 40.0;
        float k2 = step(0.5, fract(ang + h.y * 5.0)) + step(0.5, fract(ang - h.y * 5.0));
        base *= mod(k2, 2.0) < 0.5 ? 0.7 : 1.3;
      } else {
        base += vec3(0.06) * (1.0 - smoothstep(0.0, 0.03, abs(length(h.xz) - 0.72)));
      }
      acc += vec4(shade(base, n, 0.45, 28.0, 0.35), 1.0);
    }
  }
  return acc / 4.0;
}

void main() {
  float s = max(uScale, 0.001);
  vec2 uv = ((gl_FragCoord.xy / uRes) * 2.0 - 1.0) / s;
  float aa = 2.0 / (uRes.x * s);
  if (uType > 4.5) { gl_FragColor = puck(uv, aa); return; }
  float r = length(uv);
  float alpha = 1.0 - smoothstep(1.0 - aa * 1.5, 1.0, r);
  if (alpha <= 0.0) { gl_FragColor = vec4(0.0); return; }
  vec3 n = vec3(uv, sqrt(max(0.0, 1.0 - r * r)));
  vec3 q = uRot * n;
  vec3 col;
  if (uType < 0.5) col = shade(baseball(q), n, 0.18, 18.0, 0.12);
  else if (uType < 1.5) col = shade(basketball(q), n, 0.12, 10.0, 0.1);
  else if (uType < 2.5) col = shade(soccer(q), n, 0.4, 40.0, 0.12);
  else if (uType < 3.5) col = shade(volleyball(q), n, 0.3, 30.0, 0.12);
  else col = shade(tennis(q), n, 0.04, 6.0, 0.18);
  gl_FragColor = vec4(col * alpha, alpha);
}`;

const VERT = 'attribute vec2 a; void main() { gl_Position = vec4(a, 0.0, 1.0); }';
const COUNT = 6; // baseball, basketball, soccer, volleyball, tennis, puck
const HOLD = 3; // seconds per ball

// Column-major 3x3 rotations.
const rx = a => [1, 0, 0, 0, Math.cos(a), Math.sin(a), 0, -Math.sin(a), Math.cos(a)];
const ry = a => [Math.cos(a), 0, -Math.sin(a), 0, 1, 0, Math.sin(a), 0, Math.cos(a)];
const mul = (A, B) => {
  const o = [];
  for (let c = 0; c < 3; c++) for (let r = 0; r < 3; r++) o[c * 3 + r] = A[r] * B[c * 3] + A[3 + r] * B[c * 3 + 1] + A[6 + r] * B[c * 3 + 2];
  return o;
};
const easeOutBack = x => 1 + 2.7 * (x - 1) ** 3 + 1.7 * (x - 1) ** 2;

function setup(canvas) {
  const gl = canvas.getContext('webgl', { alpha: true, premultipliedAlpha: true });
  if (!gl) return null;
  const prog = gl.createProgram();
  for (const [type, src] of [[gl.VERTEX_SHADER, VERT], [gl.FRAGMENT_SHADER, FRAG]]) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, src);
    gl.compileShader(sh);
    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) { console.error(gl.getShaderInfoLog(sh)); return null; }
    gl.attachShader(prog, sh);
  }
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return null;
  gl.useProgram(prog);
  gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  gl.enableVertexAttribArray(0);
  gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);
  const u = name => gl.getUniformLocation(prog, name);
  return { gl, res: u('uRes'), rot: u('uRot'), type: u('uType'), scale: u('uScale') };
}

export default function SportsBall({ fallback }) {
  const ref = useRef();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = setup(canvas);
    if (!ctx) { setFailed(true); return; }
    const { gl } = ctx;
    const still = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = performance.now();
    let raf;
    const frame = now => {
      raf = requestAnimationFrame(frame);
      const w = canvas.clientWidth;
      if (!w) return; // hidden (e.g. closed dialog)
      const px = Math.round(w * Math.min(devicePixelRatio || 1, 3));
      if (canvas.width !== px) { canvas.width = canvas.height = px; gl.viewport(0, 0, px, px); }
      const t = still ? 0 : (now - start) / 1000;
      const type = Math.floor(t / HOLD) % COUNT;
      const ph = t % HOLD;
      const pop = ph < 0.45 ? easeOutBack(ph / 0.45) : Math.min(1, (HOLD - ph) / 0.2);
      const scale = still ? 1 : 0.6 + 0.4 * pop; // floor keeps the wordmark reading BOND mid-swap
      const spin = t * 1.2 + (ph < 0.45 ? (1 - ph / 0.45) * 2.5 : 0);
      const rot = type === 5 ? mul(rx(spin * 0.9 - 1.1), ry(0.4)) : mul(rx(0.45), ry(spin));
      gl.uniform2f(ctx.res, px, px);
      gl.uniformMatrix3fv(ctx.rot, false, rot);
      gl.uniform1f(ctx.type, type);
      gl.uniform1f(ctx.scale, Math.max(scale, 0));
      gl.clearColor(0, 0, 0, 0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
    };
    raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(raf);
      gl.getExtension('WEBGL_lose_context')?.loseContext();
    };
  }, []);

  return failed ? fallback : <canvas ref={ref} className="ball-canvas" aria-hidden="true" />;
}
