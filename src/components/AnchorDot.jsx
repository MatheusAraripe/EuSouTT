import { useEffect, useRef } from "react";

// A bolinha é a âncora do menu antes de ele existir: segue o mouse e, no
// clique, pousa no ponto onde o menu nasce. Só em ponteiro fino (desktop).
//
// Canvas 2D e não WebGL: para um disco só, criar contexto GL e shader é peso
// à toa. O canvas tem 56px e anda por `transform` — o compositor move a
// camada, nada de layout nem de repintar a tela inteira. O loop de rAF
// hiberna quando as molas assentam; o convite ao clique acorda por timeout.

const SIZE = 56; // lado do canvas em px CSS (cabe o disco esticado + raios)
const HALF = SIZE / 2;
const R = 5.5; // mesmo raio do disco da Spark do menu
const TAU = Math.PI * 2;
// Branco em `mix-blend-mode: difference` (no canvas): sobre o papel o
// resultado é o grafite de sempre (≈ preto a .75), sobre o que é escuro — a
// foto, o texto — vira claro. É a inversão cromática que mantém a bolinha
// visível em qualquer fundo, sem ler cor de pixel nenhum.
const COLOR = "rgba(255, 255, 255, 0.75)";

// Molas (k = rigidez, c = amortecimento). O seguimento fica um pouco abaixo
// do crítico (2√k ≈ 32) para chegar com uma leve sobra; a deformação bem
// abaixo, para o disco "balançar" ao parar — é daí que vem o ar líquido.
const FOLLOW = { k: 260, c: 26 };
const JELLY = { k: 340, c: 12 };
const GROW = { k: 320, c: 30 };
const STRETCH_PER_SPEED = 0.0008; // deformação por px/s
const MAX_STRETCH = 0.55;

// Convite ao clique: depois de IDLE_AFTER sem clicar, a cada IDLE_PERIOD o
// disco afunda (press) e os raios da Spark saem dele, uma vez.
const IDLE_AFTER = 2000;
const IDLE_PERIOD = 2800;
const PRESS_IN = 120;
const PRESS_OUT = 420;
const RAYS_START = 140;
const RAYS_DURATION = 620;
const IDLE_ANIM = RAYS_START + RAYS_DURATION;

// Raios da Spark (icons.jsx), de dentro para fora, com a direção unitária
// pré-calculada para o empurrão da animação.
const RAYS = [
  [-5.7, -5.1, -10.5, -6.5],
  [-4.3, -7, -6.5, -11.5],
  [-1.5, -7.5, -0.8, -12.5],
].map(([x1, y1, x2, y2]) => {
  const len = Math.hypot(x2 - x1, y2 - y1);
  return { x1, y1, x2, y2, ux: (x2 - x1) / len, uy: (y2 - y1) / len };
});

const easeOut = (t) => 1 - (1 - t) ** 3;
const clamp01 = (t) => Math.min(Math.max(t, 0), 1);

export default function AnchorDot({ anchor, hidden }) {
  const canvas = useRef(null);
  // Props viram refs: o loop lê direto, sem re-render durante a animação.
  const props = useRef({ anchor, hidden });
  const wake = useRef(() => {});

  useEffect(() => {
    props.current = { anchor, hidden };
    wake.current();
  }, [anchor, hidden]);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;

    const el = canvas.current;
    const ctx = el.getContext("2d");
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    el.width = el.height = SIZE * dpr;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)");

    const s = {
      x: 0, y: 0, vx: 0, vy: 0, // posição
      dx: 0, dy: 0, dvx: 0, dvy: 0, // deformação (vetor)
      sc: 0, vsc: 0, // escala (aparecer/sumir)
      mx: null, my: null, inside: false,
      lastClick: performance.now(),
    };
    let raf = 0;
    let timer = 0;
    let last = 0;

    // Em que ponto do convite estamos: fase da animação, raios estáticos
    // (reduced-motion) e quanto falta para a próxima vez.
    const idle = (now) => {
      if (props.current.anchor || !s.inside) return { phase: -1, wait: null };
      const elapsed = now - s.lastClick;
      if (elapsed < IDLE_AFTER) return { phase: -1, wait: IDLE_AFTER - elapsed };
      if (reduce.matches) return { phase: -1, still: true, wait: null };
      const phase = (elapsed - IDLE_AFTER) % IDLE_PERIOD;
      if (phase < IDLE_ANIM) return { phase, wait: null };
      return { phase: -1, wait: IDLE_PERIOD - phase };
    };

    const draw = (state) => {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, SIZE, SIZE);
      el.style.transform = `translate3d(${s.x - HALF}px, ${s.y - HALF}px, 0)`;
      if (s.sc < 0.01) return;

      let press = 1;
      let rays = state.still ? 1 : 0;
      let push = 0;
      if (state.phase >= 0) {
        const p = state.phase;
        press -=
          0.22 *
          (p < PRESS_IN
            ? easeOut(p / PRESS_IN)
            : 1 - easeOut(clamp01((p - PRESS_IN) / (PRESS_OUT - PRESS_IN))));
        const t = clamp01((p - RAYS_START) / RAYS_DURATION);
        rays = Math.sin(Math.PI * t);
        push = 3 * easeOut(t);
      }

      ctx.translate(HALF, HALF);
      ctx.fillStyle = COLOR;
      ctx.strokeStyle = COLOR;

      // Disco esticado na direção da deformação, área preservada.
      const m = Math.min(Math.hypot(s.dx, s.dy), MAX_STRETCH);
      const k = s.sc * press;
      ctx.save();
      ctx.rotate(Math.atan2(s.dy, s.dx));
      ctx.scale((1 + m) * k, k / (1 + m));
      ctx.beginPath();
      ctx.arc(0, 0, R, 0, TAU);
      ctx.fill();
      ctx.restore();

      if (rays > 0.01) {
        // Mesmo espelhamento da Spark do menu: raios para longe de onde o
        // menu abriria se o clique fosse agora.
        ctx.scale(
          s.x > window.innerWidth / 2 ? -1 : 1,
          s.y > window.innerHeight / 2 ? -1 : 1,
        );
        ctx.globalAlpha = rays;
        ctx.lineWidth = 1;
        ctx.lineCap = "round";
        ctx.beginPath();
        for (const r of RAYS) {
          ctx.moveTo(r.x1 + r.ux * push, r.y1 + r.uy * push);
          ctx.lineTo(r.x2 + r.ux * push, r.y2 + r.uy * push);
        }
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
    };

    const frame = (now) => {
      raf = 0;
      const dt = Math.min((now - last) / 1000, 1 / 30);
      last = now;

      const { anchor, hidden } = props.current;
      const tx = anchor ? anchor.x : s.mx;
      const ty = anchor ? anchor.y : s.my;
      const visible = anchor ? !hidden : s.inside;
      if (tx === null) return;

      // Reaparecendo do nada: nasce no alvo em vez de voar do último ponto.
      if (s.sc < 0.01 && !anchor) {
        s.x = tx;
        s.y = ty;
        s.vx = s.vy = 0;
      }

      if (reduce.matches) {
        s.x = tx;
        s.y = ty;
        s.vx = s.vy = s.dx = s.dy = s.dvx = s.dvy = s.vsc = 0;
        s.sc = visible ? 1 : 0;
      } else {
        s.vx += (FOLLOW.k * (tx - s.x) - FOLLOW.c * s.vx) * dt;
        s.vy += (FOLLOW.k * (ty - s.y) - FOLLOW.c * s.vy) * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;

        const jx = s.vx * STRETCH_PER_SPEED;
        const jy = s.vy * STRETCH_PER_SPEED;
        s.dvx += (JELLY.k * (jx - s.dx) - JELLY.c * s.dvx) * dt;
        s.dvy += (JELLY.k * (jy - s.dy) - JELLY.c * s.dvy) * dt;
        s.dx += s.dvx * dt;
        s.dy += s.dvy * dt;

        s.vsc += (GROW.k * ((visible ? 1 : 0) - s.sc) - GROW.c * s.vsc) * dt;
        s.sc = Math.max(0, s.sc + s.vsc * dt);
      }

      const state = idle(now);
      draw(state);

      const settled =
        Math.abs(tx - s.x) + Math.abs(ty - s.y) < 0.05 &&
        Math.abs(s.vx) + Math.abs(s.vy) < 0.5 &&
        Math.abs(s.dx) + Math.abs(s.dy) + Math.abs(s.dvx) + Math.abs(s.dvy) < 0.002 &&
        Math.abs((visible ? 1 : 0) - s.sc) + Math.abs(s.vsc) < 0.002;

      if (!settled || state.phase >= 0) {
        raf = requestAnimationFrame(frame);
      } else {
        // Assentou: dorme até o próximo convite (ou até o mouse mexer).
        if (!visible) s.sc = 0;
        draw(state);
        if (state.wait !== null) timer = setTimeout(start, state.wait);
      }
    };

    const start = () => {
      clearTimeout(timer);
      if (raf) return;
      last = performance.now();
      raf = requestAnimationFrame(frame);
    };
    wake.current = start;

    const onMove = (e) => {
      if (e.pointerType !== "mouse") return;
      s.mx = e.clientX;
      s.my = e.clientY;
      s.inside = true;
      start();
    };
    const onDown = () => {
      s.lastClick = performance.now();
      start();
    };
    const onLeave = () => {
      s.inside = false;
      start();
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerdown", onDown, { passive: true });
    document.documentElement.addEventListener("mouseleave", onLeave);
    window.addEventListener("blur", onLeave);

    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
      wake.current = () => {};
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerdown", onDown);
      document.documentElement.removeEventListener("mouseleave", onLeave);
      window.removeEventListener("blur", onLeave);
    };
  }, []);

  return (
    <canvas
      ref={canvas}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-20 hidden mix-blend-difference will-change-transform pointer-fine:block"
      style={{ width: SIZE, height: SIZE }}
    />
  );
}
