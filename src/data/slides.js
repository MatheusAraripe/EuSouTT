import { menu } from "./content";

// A vitrine do centro da tela mostra uma mídia por vez. A primeira é o
// retrato (com o único h1); depois vêm as dos nós do menu que têm `media`, na
// ordem em que aparecem nele. As setas percorrem essa lista em volta; abrir
// um trabalho ou projeto no menu pula direto para a mídia dele (`slideOf`).
const collect = (nodes) =>
  nodes.flatMap((n) => [
    ...(n.media ? [{ node: n, media: n.media }] : []),
    ...collect(n.children ?? []),
  ]);

export const slides = [{ portrait: true }, ...collect(menu)];

export const slideOf = (id) => slides.findIndex((s) => s.node?.id === id);
