# Recettes de code (GSAP 3 + HTML/CSS)

Base commune :

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js"></script>
<div id="stage" style="position:relative;width:100vw;aspect-ratio:16/9;overflow:hidden;perspective:1200px"></div>
```
```js
const EASE_IN = "expo.out", EASE_OUT = "power4.in";
const tl = gsap.timeline({ defaults: { ease: EASE_IN, duration: .5 } });
```

---

## 1. Titre cinétique (lettres multi-styles + sélection)

```html
<h1 class="kin">
  <span style="font-family:Georgia">B</span><span style="font-family:monospace;color:#a259ff">r</span>
  <span style="font-family:'Brush Script MT';color:#1ed38a">a</span><span style="color:#f24e1e">n</span><span>d</span>
</h1>
<div class="sel"><i></i><i></i><i></i><i></i><b class="dim">204 × 238</b></div>
```
```css
.kin span{display:inline-block;font-size:12vw;font-weight:800}
.sel{position:absolute;border:1px solid #0d99ff}
.sel i{position:absolute;width:8px;height:8px;background:#fff;border:1px solid #0d99ff}
.sel i:nth-child(1){left:-4px;top:-4px}.sel i:nth-child(2){right:-4px;top:-4px}
.sel i:nth-child(3){left:-4px;bottom:-4px}.sel i:nth-child(4){right:-4px;bottom:-4px}
.dim{position:absolute;top:100%;left:50%;translate:-50% 6px;background:#0d99ff;color:#fff;font:11px Inter;padding:2px 6px;border-radius:3px}
```
```js
tl.from(".kin span", { y: 80, rotateX: -90, opacity: 0, stagger: .06, ease: "back.out(1.6)" })
  .add(() => selectEl(".kin span:nth-child(1)"))       // déplace .sel sur la lettre
  .to(".sel", { duration: .35 }, "+=.2");
function selectEl(q){ const r=document.querySelector(q).getBoundingClientRect();
  gsap.to(".sel",{left:r.left,top:r.top,width:r.width,height:r.height,duration:.35}); }
```

## 2. Curseur multijoueur nommé

```html
<div class="cursor"><svg width="18" height="18" viewBox="0 0 18 18"><path d="M1 1l6 16 2.5-6.5L16 8z" fill="#a259ff" stroke="#fff"/></svg><span>Alex</span></div>
```
```css
.cursor{position:absolute;pointer-events:none}
.cursor span{background:#a259ff;color:#fff;font:600 11px Inter;padding:2px 6px;border-radius:4px;margin-left:10px}
```
```js
// trajectoire courbe (MotionPathPlugin) ou simple arc :
tl.to(".cursor", { x: 420, y: 160, duration: .9, ease: "power2.inOut",
  modifiers: { y: (y, t) => y } })
  .to(".cursor svg", { scale: .85, yoyo: true, repeat: 1, duration: .08 }); // clic
```

## 3. Cartes 3D flottantes + aberration chromatique

```js
for (let i = 0; i < 14; i++) {
  const c = document.createElement("div"); c.className = "card3d";
  const z = gsap.utils.random(-800, 300);
  gsap.set(c, { x: gsap.utils.random(-50, 50) + "vw", y: gsap.utils.random(-30, 30) + "vh",
    z, rotateX: gsap.utils.random(-40, 40), rotateY: gsap.utils.random(-40, 40),
    filter: `blur(${Math.abs(z) / 120}px)` });
  stage.append(c);
}
tl.from(".card3d", { z: -2000, opacity: 0, stagger: .03, duration: 1.2 })
  .to(".card3d", { rotateY: "+=40", z: "+=300", duration: 1.5, ease: "none" }, "<");
```
```css
.card3d{position:absolute;left:50%;top:50%;width:90px;height:90px;border-radius:18px;
  background:linear-gradient(135deg,#a259ff,#1ed38a);box-shadow:-3px 0 0 rgba(255,0,80,.6),3px 0 0 rgba(0,220,255,.6)}
```

## 4. Flash blanc

```js
tl.to("#flash", { opacity: 1, duration: .15, ease: "none" })
  .set("#sceneDark", { display: "none" })
  .to("#flash", { opacity: 0, duration: .35 });
```

## 5. Menu radial

```js
const items = gsap.utils.toArray(".radial .item"), R = 160;
items.forEach((el, i) => {
  const a = (i / items.length) * Math.PI * 2 - Math.PI / 2;
  tl.fromTo(el, { x: 0, y: 0, scale: .3, opacity: 0 },
    { x: Math.cos(a) * R, y: Math.sin(a) * R, scale: 1, opacity: 1, ease: "back.out(1.4)" }, i * .04);
});
```

## 6. Roue de mots 3D (cylindre)

```html
<ul class="wheel"><li>Design</li><li>Prototype</li><li>Collaborate</li><li>Build</li><li>Ship</li></ul>
<div class="pill"><img class="avatar"/><span id="active">Design</span></div>
```
```css
.wheel{position:absolute;inset:0;transform-style:preserve-3d;list-style:none}
.wheel li{position:absolute;top:50%;left:50%;font:600 42px Inter;color:#0003;backface-visibility:hidden}
.pill{position:absolute;left:50%;top:50%;translate:-50% -50%;padding:14px 40px 14px 14px;border-radius:999px;
  background:#fff;box-shadow:0 10px 30px rgba(0,0,0,.12);display:flex;gap:16px;align-items:center;font:600 42px Inter}
```
```js
const words = gsap.utils.toArray(".wheel li"), STEP = 22, RAD = 260;
words.forEach((w, i) => gsap.set(w, { rotateX: -i * STEP, transformOrigin: `50% 50% -${RAD}px`, xPercent: -50, yPercent: -50 }));
words.forEach((w, i) => tl.to(".wheel", { rotateX: i * STEP, duration: .45, ease: "power3.inOut",
  onComplete: () => (active.textContent = w.textContent) }, "+=.35"));
```

## 7. Wipe en blocs de couleur

```js
const colors = ["#f24e1e", "#0d99ff", "#1ed38a", "#a259ff", "#ff7262"];
colors.forEach((c, i) => {
  const b = Object.assign(document.createElement("div"), { className: "block" });
  b.style.cssText = `position:absolute;top:${(i % 2) * 50}%;left:${i * 20}%;width:20%;height:50%;background:${c}`;
  stage.append(b);
  tl.from(b, { yPercent: i % 2 ? 120 : -120, duration: .4, ease: "expo.out" }, `wipe+=${i * .05}`);
});
tl.to(".block", { scaleY: 0, transformOrigin: "top", stagger: .04, duration: .35, ease: EASE_OUT }, "+=.2");
```

## 8. Toolbar + zoom caméra

```js
tl.from(".toolbar", { y: 40, opacity: 0 })
  .to(".cursor", { x: toolX, y: toolY, duration: .6, ease: "power2.inOut" })
  .to(".tool.text", { background: "#0d99ff", color: "#fff", duration: .1 })
  .to("#camera", { scale: 2.4, rotateY: -18, x: "-20%", duration: 1, ease: "expo.inOut" }, "<");
```

## 9. Signature manuscrite + pointe lumineuse

Convertir le texte script en `<path>` (Figma/Illustrator → « Outline stroke » ou police single-line).

```js
const p = document.querySelector("#sig path"), L = p.getTotalLength();
gsap.set(p, { strokeDasharray: L, strokeDashoffset: L, stroke: "#fff", fill: "none", strokeWidth: 2 });
const head = document.querySelector(".glow"); // petit cercle flou cyan/rose + curseur
tl.to(p, { strokeDashoffset: 0, duration: 2.5, ease: "power1.inOut",
  onUpdate() { const pt = p.getPointAtLength(L * this.progress());
    gsap.set(head, { x: pt.x, y: pt.y }); } });
```
```css
.glow{width:14px;height:14px;border-radius:50%;background:#3ff;filter:blur(4px);box-shadow:0 0 30px 10px #3ff8}
```
Varier la couleur de la lueur dans le temps (rose → cyan → vert) via `hue-rotate`.

## 10. Blob dégradé + texte sur chemin

```html
<svg viewBox="0 0 800 300">
  <defs><filter id="goo"><feGaussianBlur stdDeviation="25"/></filter>
    <linearGradient id="g"><stop offset="0" stop-color="#ff7262"/><stop offset=".5" stop-color="#ff4fa3"/><stop offset="1" stop-color="#0d99ff"/></linearGradient>
    <path id="curve" d="M80 170 Q260 110 400 170 T720 160"/></defs>
  <ellipse cx="400" cy="170" rx="280" ry="70" fill="url(#g)" filter="url(#goo)"/>
  <text font="600 44px Inter" fill="#222"><textPath href="#curve">Commencer gratuitement</textPath></text>
</svg>
```
```js
tl.from("ellipse", { scale: 0, transformOrigin: "50% 50%", duration: .8, ease: "expo.out" })
  .to("#curve", { attr: { d: "M80 160 Q260 220 400 160 T720 175" }, duration: 1.2, yoyo: true, repeat: 1, ease: "sine.inOut" }, "<");
```

## 11. Final : logo + mascotte

```js
tl.from(".logo", { scale: 0, rotate: -20, ease: "back.out(2)" })
  .to(".logo", { x: "-12vw", delay: .4 })
  .from(".mascot", { x: "12vw", opacity: 0, scale: .6, ease: "back.out(1.8)" }, "<")
  .to("#stage", { background: "#111522", duration: .3 })
  .from(".handle-bar", { scaleX: 0, transformOrigin: "left", duration: .5 });
// glitch RGB outro
gsap.to(".handle-bar", { boxShadow: "-4px 0 #ff2d55, 4px 0 #20e3e3", repeat: 5, yoyo: true, duration: .05, delay: tl.duration() - .6 });
```

---

## Équivalents

- **Framer Motion** : `transition={{ ease: [0.16,1,0.3,1], duration: .5 }}`, `staggerChildren: .05`, `useAnimate()` pour séquencer.
- **Remotion** : `interpolate(frame, [0,15], [0,1], { easing: Easing.bezier(.16,1,.3,1) })`, une `<Sequence from={...}>` par scène (30 fps → 1 s = 30 frames).
- **Reduced motion** : `if (matchMedia('(prefers-reduced-motion: reduce)').matches) tl.timeScale(100)` ou remplacer par des fondus.
