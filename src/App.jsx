import { useEffect, useLayoutEffect, useRef, useState } from "react";
import AnchorDot from "./components/AnchorDot";
import Menu from "./components/Menu";
import photo from "./assets/image/tt.webp";

let invocations = 0;

// O portfólio é uma tela só. Clicar em qualquer lugar invoca o menu naquele
// ponto; clicar fora dele o dispensa; o próximo clique o invoca de novo, do
// zero.
export default function App() {
  const [invocation, setInvocation] = useState(null);
  // Onde a âncora do menu aberto está e em que nível ele se encontra.
  const [anchor, setAnchor] = useState(null);
  const hint = useRef(null);
  const center = useRef(null);
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

  // Menu aberto em cima da foto fica ilegível (texto preto sobre foto
  // escura). A caixa dele é fixa por invocação, então basta um teste: se
  // cobre o centro, foto e título recuam. Aberto longe, como no protótipo,
  // tudo continua visível. Escrito no DOM, fora do React.
  useLayoutEffect(() => {
    const box = invocation ? anchor?.box : null;
    const r = center.current.getBoundingClientRect();
    const covered =
      box &&
      box.left < r.right &&
      box.right > r.left &&
      box.top < r.bottom &&
      box.bottom > r.top;
    center.current.dataset.covered = covered ? "true" : "false";
  }, [invocation, anchor]);

  // Com o menu fechado a tela inteira é o botão que o invoca: o cursor de
  // clique reforça o convite da bolinha. Aberto, clicar fora só dispensa —
  // volta o cursor padrão, e o pointer fica com os itens do menu.
  return (
    <main
      className={`grid h-dvh place-items-center overflow-hidden ${invocation ? "" : "cursor-pointer"}`}
    >
      <AnchorDot
        anchor={invocation ? anchor : null}
        hidden={Boolean(anchor?.depth)}
      />

      {/* Centro da tela: foto e o único h1. Clicar nela também invoca o menu
          (é parte da tela). Tamanhos em múltiplos de 4, um degrau menor no
          celular, como o texto: 144×192 → 192×256. `tt.webp` é a versão
          leve de `tt.jpg` (480×640). */}
      <div
        ref={center}
        className="flex flex-col items-start transition-opacity duration-300 select-none data-[covered=true]:opacity-10"
      >
        <img
          src={photo}
          alt="Retrato de Matheus Araripe"
          width="480"
          height="640"
          decoding="async"
          draggable={false}
          className="h-48 w-36 object-cover sm:h-64 sm:w-48"
        />
        <h1 className="type-h1 mt-2 text-black/75">
          Matheus Araripe,
          <br />
          um designer que programa
        </h1>

        {/* No desktop quem convida ao clique é a bolinha; o aviso só aparece
            no toque e, para o teclado, ao receber foco. */}
        <button
          ref={hint}
          type="button"
          onClick={openFromKeyboard}
          className={`mt-4 cursor-pointer font-serif text-small text-black/70 transition-[opacity,visibility] duration-300 focus-visible:outline-1 focus-visible:outline-offset-4 focus-visible:outline-accent pointer-fine:not-focus-visible:sr-only ${invocation ? "invisible opacity-0" : ""}`}
        >
          <span className="pointer-coarse:hidden">
            Clique em qualquer lugar
          </span>
          <span className="hidden pointer-coarse:inline">
            Toque em qualquer lugar
          </span>
        </button>
      </div>

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
