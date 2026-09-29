import { useCallback, useEffect, useRef } from "react";

/**
 * Texto cinza com uma "lanterna" que revela o preto sob o cursor/dedo.
 *
 * Otimizações:
 * - o retângulo do elemento é medido só ao entrar (e invalidado em scroll/resize),
 *   evitando um reflow síncrono a cada pointermove;
 * - a escrita das custom properties é agrupada num único requestAnimationFrame;
 * - nada disso passa pelo React — zero re-render durante a interação.
 */
export default function ForceFieldText({ children, className = "" }) {
  const rootRef = useRef(null);
  const overlayRef = useRef(null);
  const rectRef = useRef(null);
  const frameRef = useRef(0);
  const pointRef = useRef({ x: 0, y: 0 });

  const invalidateRect = useCallback(() => {
    rectRef.current = null;
  }, []);

  const flush = useCallback(() => {
    frameRef.current = 0;
    const overlay = overlayRef.current;
    if (!overlay) return;
    const { x, y } = pointRef.current;
    overlay.style.setProperty("--x", `${x}px`);
    overlay.style.setProperty("--y", `${y}px`);
    overlay.style.opacity = "1";
  }, []);

  const track = useCallback(
    (clientX, clientY) => {
      const root = rootRef.current;
      if (!root) return;

      if (!rectRef.current) rectRef.current = root.getBoundingClientRect();
      const rect = rectRef.current;

      pointRef.current = { x: clientX - rect.left, y: clientY - rect.top };
      if (!frameRef.current) frameRef.current = requestAnimationFrame(flush);
    },
    [flush],
  );

  const hide = useCallback(() => {
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
    invalidateRect();
    if (overlayRef.current) overlayRef.current.style.opacity = "0";
  }, [invalidateRect]);

  // --- Desktop (mouse / caneta) ---
  const handlePointerMove = (event) => {
    if (event.pointerType === "touch") return; // o toque é tratado abaixo
    track(event.clientX, event.clientY);
  };

  const handlePointerLeave = (event) => {
    if (event.pointerType === "touch") return;
    hide();
  };

  // --- Mobile (toque) ---
  const handleTouchMove = (event) => {
    const touch = event.touches[0];
    if (touch) track(touch.clientX, touch.clientY);
  };

  useEffect(() => {
    // O rect é relativo à viewport: qualquer scroll/resize invalida o cache.
    window.addEventListener("scroll", invalidateRect, { passive: true });
    window.addEventListener("resize", invalidateRect, { passive: true });
    return () => {
      window.removeEventListener("scroll", invalidateRect);
      window.removeEventListener("resize", invalidateRect);
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [invalidateRect]);

  return (
    <div
      ref={rootRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onTouchStart={handleTouchMove}
      onTouchMove={handleTouchMove}
      onTouchEnd={hide}
      onTouchCancel={hide}
      className="relative w-full"
    >
      {/* TEXTO BASE: cinza */}
      <p className={`text-gray-400 ${className}`}>{children}</p>

      {/* TEXTO DE DESTAQUE: preto puro, revelado por máscara na GPU */}
      <p
        ref={overlayRef}
        aria-hidden="true"
        className={`pointer-events-none absolute inset-0 text-black transition-opacity duration-300 ${className}`}
        style={{
          opacity: 0,
          WebkitMaskImage:
            "radial-gradient(circle 140px at var(--x, 50%) var(--y, 50%), black 15%, transparent 100%)",
          maskImage:
            "radial-gradient(circle 140px at var(--x, 50%) var(--y, 50%), black 15%, transparent 100%)",
        }}
      >
        {children}
      </p>
    </div>
  );
}
