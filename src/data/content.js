// Fonte única de conteúdo do site.
// O site inteiro é o menu: cada nó é uma tela dele. Um nó abre outro nível se
// tiver `children`, `body`, `lede` ou `points`; vira link se tiver `href`;
// sem nada disso é só texto (e por isso não recebe risco nem foco).
//
//   title     texto principal do item
//   meta      linha mono embaixo do título (empresa, ano…)
//   body      parágrafos exibidos quando o nó está aberto
//   lede      frase curta de abertura (trabalhos), alinhada como o título
//   points    tópicos: "manchete" ou ["manchete", "detalhe"] — a manchete
//             é o que se lê passando o olho; o detalhe, quem quer saber mais
//   children  subitens listados depois do body
//   href      destino externo
//   media     o que aparece no centro da tela quando o nó é aberto (ver
//             MÍDIAS abaixo); `link` vira o destino de um clique nela
//
// `id` precisa ser único no menu inteiro: é por ele que o título "viaja" da
// lista até o cabeçalho quando o nó é aberto.

import inexplicavelMotion from "../assets/media/inexplicavel/motion.mp4";
import inexplicavelPoster from "../assets/media/inexplicavel/poster.webp";
import mariaEulaliaMotion from "../assets/media/maria-eulalia/motion.mp4";
import mariaEulaliaPoster from "../assets/media/maria-eulalia/poster.webp";
import mariaViewMotion from "../assets/media/maria-view/motion.mp4";
import mariaViewPoster from "../assets/media/maria-view/poster.webp";
import ulissesMotion from "../assets/media/ulisses-xavier/motion.mp4";
import ulissesPoster from "../assets/media/ulisses-xavier/poster.webp";

// --- MÍDIAS ------------------------------------------------------------------
// Versões leves dos originais (src/assets/image, src/assets/motion): WebP com
// 480px no lado menor e vídeo 720×720 sem áudio. O centro da tela mostra uma
// por vez, na ordem do menu.
//
//   motion     vídeo quadrado em loop, mudo; `poster` é o primeiro quadro
//   moodboard  `items` em grade; `area` é a célula do molde (index.css)
//              (a–g no desktop; no celular só a, b, c, e, g aparecem).
//              Hoje nenhum nó usa: os trabalhos são contados em motion.
//
// `label` é o nome que cataloga a mídia sob ela (o da marca, não o cargo).
const mariaEulaliaMedia = {
  kind: "motion",
  label: "Maria Eulália",
  src: mariaEulaliaMotion,
  poster: mariaEulaliaPoster,
  alt: "Apresentação do trabalho na Maria Eulália: guia de medidas na página da joia e vitrine própria no celular",
};

const inexplicavelMedia = {
  kind: "motion",
  label: "Inexplicável",
  src: inexplicavelMotion,
  poster: inexplicavelPoster,
  alt: "Apresentação do design system da Inexplicável: logo, rótulos por cor, tokens e stories gerados por template",
};

const ulissesMedia = {
  kind: "motion",
  label: "UlissesXavier",
  src: ulissesMotion,
  poster: ulissesPoster,
  alt: "Apresentação do UlissesXavier, o seu nerdzinho de UX, rodando no Claude Code",
};

const mariaViewMedia = {
  kind: "motion",
  label: "Maria.view",
  src: mariaViewMotion,
  poster: mariaViewPoster,
  alt: "Apresentação do Maria.view: 83.670 linhas de um único .out do ORCA",
};

// --- TRABALHO -----------------------------------------------------------------
// Estrutura do CV (src/assets/CV): cada trabalho é uma tela só — uma linha
// de abertura (`lede`, quando há) e os resultados em tópicos (`points`,
// manchete + detalhe; a manchete sozinha precisa fazer sentido). Não
// há mais níveis abaixo de um trabalho: quem entra lê, não navega.
const works = [
  {
    id: "maria-eulalia",
    title: "Design Engineer",
    meta: ["Maria Eulália", "01/26 – atualmente"],
    link: "https://www.mariaeulalia.com.br/",
    media: mariaEulaliaMedia,
    lede: "Ferramentas sob medida para a equipe e para quem compra.",
    points: [
      ["Menos dúvida na compra", "guia de medidas que aparece sozinho por tipo de joia"],
      ["Marketing autônomo", "blocos editáveis, sem depender de código"],
      ["Preços e botões que se ajustam sozinhos", "sem erro manual"],
    ],
  },
  {
    id: "inexplicavel",
    title: "Design System & Identidade",
    meta: ["Inexplicável", "01/26 – atualmente"],
    link: "https://www.instagram.com/inexplicavelvinhos",
    media: inexplicavelMedia,
    lede: "Transformei a identidade da marca em um sistema que gera as artes.",
    points: [
      [
        "Design tokens em um arquivo só",
        "cor, tipografia, grade e espaçamento geram o CSS e alimentam os templates das peças",
      ],
      [
        "Posts gerados por template",
        "com as margens de proteção resolvidas por um solver de restrições (Cassowary) em vez de ajuste no olho",
      ],
      [
        "O sistema se verifica sozinho",
        "um grafo acusa referência quebrada, ciclo e valor fora da escala antes da arte sair",
      ],
      [
        "A identidade por trás disso",
        "logo, rótulos e manual de marca criados do zero",
      ],
    ],
  },
  {
    id: "nova-tendencia",
    title: "Front-end Engineer",
    meta: ["Nova Tendência", "03/23 – 04/24"],
    link: "https://portal-parceiros.cld.brasilseg.com.br/",
    lede: "Projeto: Portal de Parceiros da BB Seguros",
    points: [
      "Efetivado em 7 meses",
      ["Sistema financeiro complexo", "em telas simples"],
      ["Componentes reutilizáveis", "que mantêm o visual consistente"],
    ],
  },
  {
    id: "fiocruz",
    title: "Iniciação Científica",
    meta: ["Fiocruz", "01/22 – 12/22"],
    link: "https://journals.sagepub.com/doi/10.1177/00236772231194957",
    points: [
      "Artigo publicado na Laboratory Animals",
      ["Menos erro nas pesquisas", "com cálculo automatizado"],
      ["Interface simples", "para quem não é da área técnica"],
    ],
  },
];

// --- PROJETO ------------------------------------------------------------------
// Mesma estrutura de Trabalho, com a seção PROJETOS do CV.
const projects = [
  {
    id: "ulisses-xavier",
    title: "UlissesXavier",
    meta: ["o seu nerdzinho de UX"],
    link: "https://github.com/MatheusAraripe/UlissesXavier",
    media: ulissesMedia,
    points: [
      ["Revisão de UX baseada em evidência", "para times sem especialista"],
      "Mede acessibilidade, fluidez e consistência visual",
      [
        "Primeiro teste",
        "três caminhos de perda de dados e texto abaixo do mínimo de acessibilidade, corrigidos na mesma semana (contraste de 3,26:1 para 7,4:1)",
      ],
    ],
  },
  {
    id: "maria-view",
    title: "Maria.view",
    meta: ["10/25 – atualmente"],
    link: "https://maria-view.onrender.com/#/",
    media: mariaViewMedia,
    points: [
      ["Moléculas complexas em 3D", "para pesquisadores de química da UFRJ"],
      "Interface Orientada a Objetos (OOUI)",
      ["Interface precisa e responsiva", "com indicadores visuais de seleção"],
    ],
  },
];

// --- CONTATO ------------------------------------------------------------------
const socials = [
  {
    id: "linkedin",
    title: "LinkedIn",
    href: "https://www.linkedin.com/in/matheus-araripe/",
  },
  {
    id: "behance",
    title: "Behance",
    href: "https://www.behance.net/matheusararipe",
  },
  { id: "github", title: "GitHub", href: "https://github.com/MatheusAraripe" },
];

// --- RAIZ ---------------------------------------------------------------------
// O que aparece quando o menu é invocado.
export const menu = [
  {
    id: "sobre",
    title: "Sobre",
    meta: ["TT"],
    body: [
      "Sou um designer e desenvolvedor multidisciplinar guiado por uma forte visão de produto e pelo comportamento humano. Minha principal vantagem competitiva é a leitura da cultura e um faro apurado para o Zeitgeist. Entendo profundamente como a sociedade pensa e compreendo a dinâmica das tribos, o que me confere uma base estratégica sólida para conceber marcas, produtos e campanhas que realmente ressoam com o público.",
      "Na minha forma de trabalhar, estruturo essa visão através de três arquétipos centrais:",
    ],
    // Os três arquétipos viram tópicos, como os de um trabalho.
    children: [
      {
        id: "sobre-prototipador",
        title: "Prototipador",
        body: [
          "Como Prototipador, utilizo essa sensibilidade social para mapear possibilidades e testar hipóteses. Antes de desenhar, busco o alinhamento cultural, criando conceitos e ecossistemas de marca fortes e funcionais que se conectem de verdade com as pessoas.",
        ],
      },
      {
        id: "sobre-construtor",
        title: "Construtor",
        body: [
          "Como Construtor, traduzo esse entendimento humano em execução prática. Construo produtos digitais com pragmatismo, transformando a visão estratégica inicial em soluções reais, responsivas e de alto impacto.",
        ],
      },
      {
        id: "sobre-limpador",
        title: "Limpador",
        body: [
          "Por fim, assumo a postura de Limpador para proteger a essência do produto. Removo ruídos, elimino complexidades e simplifico arquiteturas. Meu objetivo final é entregar soluções enxutas, garantindo que a comunicação da marca seja clara e que a experiência seja impecável, livre de atritos e perfeitamente alinhada à forma como o público consome e interage.",
        ],
      },
    ],
  },
  { id: "trabalho", title: "Trabalhos", children: works },
  { id: "projeto", title: "Projetos", children: projects },
  { id: "contato", title: "Contato", children: socials },
];
