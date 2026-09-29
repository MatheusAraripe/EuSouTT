import { useEffect, useRef } from "react";

const BASE_RADIUS = 6;
const HOVER_RADIUS = 22;

// Glifo do olho, o mesmo desenho de `skillIcons.jsx` (viewBox 24x24, centro 12,12).
const EYE_ALMOND = "M2.4 12C5.4 6.6 18.6 6.6 21.6 12c-3 5.4-16.2 5.4-19.2 0Z";
const EYE_PUPIL_R = 2.3; // em unidades do viewBox
const EYE_SIZE = 38; // lado da caixa do glifo, em px de tela
const EYE_DELAY = 0.35; // fração do crescimento antes do olho começar a aparecer

/**
 * Cursor customizado desenhado em canvas com mix-blend-difference.
 *
 * Em repouso é um círculo de raio BASE_RADIUS. Sobre um elemento clicável ele
 * cresce até HOVER_RADIUS e um olho aparece dentro — sem trocar de forma.
 *
 * O olho é VAZADO do disco (`destination-out`), não desenhado por cima: como o
 * canvas inteiro está em mix-blend-difference, pixel transparente deixa a página
 * passar intacta, então o buraco lê como branco sobre o disco preto. Pintar o
 * glifo de branco por cima não funcionaria — branco sobre branco some.
 *
 * São duas passadas: vaza-se a amêndoa inteira (vira a parte branca do olho) e
 * repinta-se a pupila (volta a ser disco, logo preta). Vazar só o contorno
 * deixaria a pupila branca dentro de uma esclera preta — um olho ao contrário.
 *
 * Otimizações:
 * - o loop de rAF hiberna quando o ponteiro está parado e o disco terminou de
 *   crescer — inclusive durante o hover, já que nada anima sozinho;
 * - o canvas respeita o devicePixelRatio (nítido em telas retina);
 * - listeners passivos e delegação com early-return;
 * - desativado por completo em telas de toque e com prefers-reduced-motion.
 */
export default function CustomCursor() {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (window.matchMedia("(pointer: coarse)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d", { alpha: true });

    let width = 0;
    let height = 0;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const mouse = { x: width / 2, y: height / 2 };
    const pos = { x: mouse.x, y: mouse.y };
    let isHovering = false;
    let hoverState = 0;
    let frameId = 0;

    // Path2D depende do browser, então nasce aqui dentro do efeito (uma vez por
    // mount) em vez do escopo do módulo.
    const eyeAlmond = new Path2D(EYE_ALMOND);
    const eyePupil = new Path2D();
    eyePupil.arc(12, 12, EYE_PUPIL_R, 0, Math.PI * 2);

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      pos.x += (mouse.x - pos.x) * 0.2;
      pos.y += (mouse.y - pos.y) * 0.2;

      const target = isHovering ? 1 : 0;
      hoverState += (target - hoverState) * 0.15;
      // Encaixa no alvo em vez de tender a ele para sempre: é o que deixa o
      // loop hibernar com o disco já crescido.
      if (Math.abs(target - hoverState) < 0.002) hoverState = target;

      const radius = BASE_RADIUS + (HOVER_RADIUS - BASE_RADIUS) * hoverState;

      ctx.fillStyle = "#ffffff";
      ctx.beginPath();
      ctx.arc(pos.x, pos.y, radius, 0, Math.PI * 2);
      ctx.fill();

      // O olho entra escalando do centro, já com o disco meio crescido.
      const reveal = (hoverState - EYE_DELAY) / (1 - EYE_DELAY);
      if (reveal > 0.01) {
        const scale = (EYE_SIZE / 24) * reveal;
        ctx.save();
        ctx.translate(pos.x, pos.y);
        ctx.scale(scale, scale);
        ctx.translate(-12, -12);
        // Vaza a amêndoa inteira: vira a parte branca do olho.
        ctx.globalCompositeOperation = "destination-out";
        ctx.fillStyle = "#000";
        ctx.fill(eyeAlmond);
        // E devolve o disco no miolo: a pupila volta a ser preta.
        ctx.globalCompositeOperation = "source-over";
        ctx.fillStyle = "#ffffff";
        ctx.fill(eyePupil);
        ctx.restore();
      }
    };

    // Nada mais muda quando o disco chegou ao tamanho alvo e alcançou o mouse —
    // vale tanto em repouso quanto parado sobre um link.
    const isSettled = () =>
      hoverState === (isHovering ? 1 : 0) &&
      Math.abs(mouse.x - pos.x) < 0.05 &&
      Math.abs(mouse.y - pos.y) < 0.05;

    const render = () => {
      draw();
      frameId = isSettled() ? 0 : requestAnimationFrame(render);
    };

    const wake = () => {
      if (!frameId) frameId = requestAnimationFrame(render);
    };

    const onMouseMove = (event) => {
      mouse.x = event.clientX;
      mouse.y = event.clientY;
      wake();
    };

    const onMouseOver = (event) => {
      if (isHovering) return;
      if (event.target.closest?.("a, button, [data-interactive]")) {
        isHovering = true;
        wake();
      }
    };

    const onMouseOut = (event) => {
      if (!isHovering) return;
      if (event.target.closest?.("a, button, [data-interactive]")) {
        isHovering = false;
        wake();
      }
    };

    const onResize = () => {
      resize();
      wake();
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseover", onMouseOver, { passive: true });
    window.addEventListener("mouseout", onMouseOut, { passive: true });
    window.addEventListener("resize", onResize, { passive: true });
    wake();

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
      window.removeEventListener("resize", onResize);
      if (frameId) cancelAnimationFrame(frameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none fixed top-0 left-0 z-9999 hidden h-screen w-screen mix-blend-difference md:block"
    />
  );
}
