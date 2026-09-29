import { useEffect, useRef, useState } from "react";
import AnchorDot from "./components/AnchorDot";
import Menu from "./components/Menu";

let invocations = 0;

// O portfólio é uma tela só. Clicar em qualquer lugar invoca o menu naquele
// ponto; clicar fora dele o dispensa; o próximo clique o invoca de novo, do
// zero.
export default function App() {
  const [invocation, setInvocation] = useState(null);
  // Onde a âncora do menu aberto está e em que nível ele se encontra.
  const [anchor, setAnchor] = useState(null);
  const hint = useRef(null);
  const restoreFocus = useRef(false);

  useEffect(() => {
    const onClick = (e) => {
      // Clique sintetizado por teclado (Enter/Espaço) não tem coordenada útil.
      if (e.detail === 0 || e.button !== 0) return;
      // composedPath e não contains: quando este listener roda, o React pode
      // já ter trocado a tela e desmontado o botão clicado.
      const inside = e
        .composedPath()
        .some((el) => el instanceof Element && el.hasAttribute("data-menu"));
      if (inside) return;
      setInvocation((current) =>
        current ? null : { key: ++invocations, x: e.clientX, y: e.clientY },
      );
    };
    window.addEventListener("click", onClick);
    return () => window.removeEventListener("click", onClick);
  }, []);

  useEffect(() => {
    if (!invocation) {
      if (restoreFocus.current) {
        restoreFocus.current = false;
        hint.current?.focus();
      }
      return;
    }
    const close = () => setInvocation(null);
    const onKey = (e) => {
      if (e.key !== "Escape") return;
      restoreFocus.current = Boolean(invocation.keyboard);
      close();
    };
    // A caixa é calculada para a tela do momento da invocação.
    window.addEventListener("resize", close);
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("resize", close);
      window.removeEventListener("keydown", onKey);
    };
  }, [invocation]);

  // Pelo teclado não existe "ponto da tela": o menu nasce sobre o aviso.
  const openFromKeyboard = (e) => {
    if (e.detail !== 0) return;
    const r = e.currentTarget.getBoundingClientRect();
    setInvocation({
      key: ++invocations,
      x: r.left + r.width / 2,
      y: r.top + r.height / 2,
      keyboard: true,
    });
  };

  return (
    <main className="grid h-dvh place-items-center overflow-hidden">
      <h1 className="sr-only">Matheus Araripe, um designer que programa</h1>

      <AnchorDot
        anchor={invocation ? anchor : null}
        hidden={Boolean(anchor?.depth)}
      />

      {/* No desktop quem convida ao clique é a bolinha; o aviso só aparece
          no toque e, para o teclado, ao receber foco. */}
      <button
        ref={hint}
        type="button"
        onClick={openFromKeyboard}
        className={`cursor-pointer font-serif text-xs text-black/70 transition-[opacity,visibility] duration-300 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-accent pointer-fine:not-focus-visible:sr-only ${invocation ? "invisible opacity-0" : ""}`}
      >
        <span className="pointer-coarse:hidden">Clique em qualquer lugar</span>
        <span className="hidden pointer-coarse:inline">Toque em qualquer lugar</span>
      </button>

      {invocation && (
        <Menu
          key={invocation.key}
          x={invocation.x}
          y={invocation.y}
          autoFocus={invocation.keyboard}
          onAnchor={setAnchor}
        />
      )}
    </main>
  );
}
