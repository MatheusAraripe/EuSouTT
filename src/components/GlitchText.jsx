import { useState, useRef, useEffect, useMemo, Fragment } from "react";

const charMap = {
  a: ["@", "4"],
  b: ["8"],
  c: ["<"],
  d: ["#"],
  e: ["8", "3"],
  f: ["&", "7"],
  g: ["%"],
  h: ["6"],
  i: ["="],
  j: ["!"],
  k: [";"],
  l: ["<"],
  m: ["1"],
  n: ["W"],
  o: ["~", "#"],
  p: ["o"],
  q: ["}"],
  r: ["9"],
  s: ["7", "?"],
  t: ["["],
  u: ["V"],
  v: ["U"],
  w: ["M"],
  x: ["*", "+"],
  y: ["?"],
  z: ["2", "\\"],
};

const colors = [
  "#e63946",
  "#457b9d",
  "#f4a261",
  "#8338ec",
  "#ff006e",
  "#2a9d8f",
  "#000000",
];

// --- FUNÇÕES AUXILIARES PURAS (Fora do Componente) ---
const shuffle = (array) => [...array].sort(() => 0.5 - Math.random());
const getRandomElement = (array) =>
  array[Math.floor(Math.random() * array.length)];
const getRandomNumber = (min, max) =>
  Math.floor(Math.random() * (max - min)) + min;

const idleChar = (char) => ({
  char,
  color: "inherit",
  originalChar: char,
  hasBorder: false,
  borderColor: "transparent",
  pixelText: "",
});

const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const BASE_DELAY = 60;

export default function GlitchText({ children, className = "" }) {
  const originalText = String(children);

  // Derivados do texto: recalculados só quando o texto muda, não a cada render.
  // Índices agrupados por palavra: cada palavra vira um inline-block próprio,
  // então a quebra de linha só acontece nos espaços (e não no meio da palavra).
  const { textArray, validIndices, words } = useMemo(() => {
    const arr = originalText.split("");
    const valid = [];
    const grouped = [];
    let current = null;

    arr.forEach((char, index) => {
      if (char === " ") {
        current = null;
        return;
      }
      valid.push(index);
      if (!current) {
        current = [];
        grouped.push(current);
      }
      current.push(index);
    });

    return { textArray: arr, validIndices: valid, words: grouped };
  }, [originalText]);

  const [chars, setChars] = useState(() => textArray.map(idleChar));

  const isTouch = useRef(false);
  const timeouts = useRef([]);
  const glitchedIndices = useRef([]);

  const clearAllTimeouts = () => {
    timeouts.current.forEach(clearTimeout);
    timeouts.current = [];
  };

  useEffect(() => clearAllTimeouts, []);

  const triggerGlitchIn = (isMobile) => {
    if (prefersReducedMotion()) return;
    clearAllTimeouts();

    setChars(textArray.map(idleChar));

    const replaceCount = Math.max(1, Math.floor(validIndices.length * 0.5));
    const borderCount = Math.max(1, Math.floor(validIndices.length * 0.2));

    const indicesToReplace = new Set(
      shuffle(validIndices).slice(0, replaceCount),
    );
    const indicesWithBorder = new Set(
      shuffle(validIndices).slice(0, borderCount),
    );

    let lastColor = null;
    const itemsToAnimate = [];

    for (let i = 0; i < textArray.length; i++) {
      const originalChar = textArray[i];
      if (originalChar === " ") continue;

      let newChar = originalChar;
      if (indicesToReplace.has(i)) {
        const options = charMap[originalChar.toLowerCase()];
        if (options) newChar = getRandomElement(options);
      }

      const newColor = getRandomElement(colors.filter((c) => c !== lastColor));
      lastColor = newColor;

      const hasBorder = indicesWithBorder.has(i);
      let borderColor = "transparent";
      let pixelText = "";

      if (hasBorder) {
        borderColor = getRandomElement(colors.filter((c) => c !== newColor));
        pixelText = `Δx=${getRandomNumber(10, 30)}px`;
      }

      itemsToAnimate.push({
        originalIndex: i,
        originalChar,
        targetState: {
          char: newChar,
          color: newColor,
          originalChar,
          hasBorder,
          borderColor,
          pixelText,
        },
      });
    }

    glitchedIndices.current = itemsToAnimate.map((item) => item.originalIndex);
    itemsToAnimate.sort(
      (a, b) => b.originalChar.charCodeAt(0) - a.originalChar.charCodeAt(0),
    );

    itemsToAnimate.forEach((item, sortRank) => {
      const tId = setTimeout(() => {
        setChars((prev) => {
          const next = [...prev];
          next[item.originalIndex] = item.targetState;
          return next;
        });
      }, sortRank * BASE_DELAY);
      timeouts.current.push(tId);
    });

    if (isMobile) {
      const totalTransformTime = itemsToAnimate.length * BASE_DELAY;
      timeouts.current.push(
        setTimeout(triggerGlitchOut, totalTransformTime + 1000),
      );
    }
  };

  const triggerGlitchOut = () => {
    clearAllTimeouts();

    const glitched = new Set(glitchedIndices.current);
    const itemsToRevert = textArray
      .map((char, index) => ({ originalChar: char, originalIndex: index }))
      .filter((item) => glitched.has(item.originalIndex));

    itemsToRevert.sort(
      (a, b) => b.originalChar.charCodeAt(0) - a.originalChar.charCodeAt(0),
    );

    itemsToRevert.forEach((item, sortRank) => {
      const tId = setTimeout(() => {
        setChars((prev) => {
          const next = [...prev];
          next[item.originalIndex] = idleChar(item.originalChar);
          return next;
        });
      }, sortRank * BASE_DELAY);
      timeouts.current.push(tId);
    });
  };

  const handleMouseEnter = () => {
    if (!isTouch.current) triggerGlitchIn(false);
  };

  const handleMouseLeave = () => {
    if (!isTouch.current) triggerGlitchOut();
  };

  const handleTouchStart = () => {
    isTouch.current = true;
    triggerGlitchIn(true);
  };

  return (
    <span
      className={`inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      style={{ userSelect: "none", WebkitTapHighlightColor: "transparent" }}
    >
      {/* Leitores de tela recebem o texto limpo; os spans animados são ignorados. */}
      <span className="sr-only">{originalText}</span>

      {words.map((word, wordIndex) => (
        <Fragment key={wordIndex}>
          {/* espaço real entre palavras: é aqui que a linha pode quebrar */}
          {wordIndex > 0 && " "}
          <span aria-hidden="true" className="inline-block whitespace-nowrap">
            {word.map((index) => {
              const item = chars[index];
              return (
                // Sem peso nem espaçamento próprios: em repouso o texto fica
                // idêntico ao do item que o envolve.
                <span
                  key={index}
                  className="relative inline-block"
                  style={{ color: item.color }}
                >
                  {item.char}

                  {item.hasBorder && (
                    <>
                      <span
                        className="pointer-events-none absolute inset-0 border"
                        style={{ borderColor: item.borderColor }}
                      />
                      <span
                        className="pointer-events-none absolute -right-3 -bottom-4 font-mono text-[8px] tracking-tighter whitespace-nowrap"
                        style={{ color: item.borderColor }}
                      >
                        {item.pixelText}
                      </span>
                    </>
                  )}
                </span>
              );
            })}
          </span>
        </Fragment>
      ))}
    </span>
  );
}
