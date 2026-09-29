// Fonte única de conteúdo do site.
// O site inteiro é o menu: cada nó é uma tela dele. Um nó abre outro nível se
// tiver `children` ou `body`; vira link se tiver `href`; sem nenhum dos três é
// só texto (e por isso não recebe glitch nem foco).
//
//   title     texto principal do item
//   meta      linha mono embaixo do título (empresa, ano…)
//   body      parágrafos exibidos quando o nó está aberto
//   children  subitens listados depois do body
//   href      destino externo
//
// `id` precisa ser único no menu inteiro: é por ele que o título "viaja" da
// lista até o cabeçalho quando o nó é aberto.

// --- TRABALHO -----------------------------------------------------------------
// Estrutura do CV (src/assets/CV): cada trabalho tem um parágrafo de abertura
// e tópicos, e cada tópico abre o próprio texto. Títulos, subtítulos e links
// vieram do Figma; os textos dos tópicos, do CV.
const works = [
  {
    id: "maria-eulalia",
    title: "Dev Front-end & UI Designer",
    meta: ["Maria Eulália", "2026"],
    link: "https://www.mariaeulalia.com.br/",
    body: [
      "Criação de ferramentas customizadas que deram autonomia para a equipe da loja e melhoraram a jornada de compra do cliente.",
    ],
    children: [
      {
        id: "maria-eulalia-componentes",
        title: "Desenvolvimento de Componentes Dinâmicos (Shopify Liquid)",
        body: [
          "Engenharia de uma “Gaveta de Medidas” (Side Drawer) interativa na página de produto. Implementação de renderização condicional que exibe conteúdos específicos automaticamente com base na categoria da joia, reduzindo o atrito na jornada de compra.",
        ],
      },
      {
        id: "maria-eulalia-tema",
        title: "Arquitetura de Tema e Autonomia",
        body: [
          "Criação de blocos nativos customizados no painel da Shopify utilizando JSON Schema. Otimização da manutenção do e-commerce, permitindo que a equipe de marketing edite chamadas para ação (CTAs) e regras de negócio sem qualquer intervenção técnica.",
        ],
      },
      {
        id: "maria-eulalia-ui",
        title: "UI/UX & Front-end",
        body: [
          "Construção de interfaces premium em JavaScript e CSS, incorporando efeitos modernos como Glassmorphism (backdrop-filter), transições fluidas, navegação interna por abas e design 100% responsivo (Mobile-First) focado em usabilidade.",
        ],
      },
      {
        id: "maria-eulalia-precificacao",
        title: "Lógica de Negócios e Regras de Precificação",
        body: [
          "Programação de lógicas condicionais no backend do front-end (Liquid) para controle de exibição de preços, como a automação de botões de conversão (“Comprar” para “Sob Consulta”) baseada na leitura de tags dinâmicas no cadastro do produto.",
        ],
      },
    ],
  },
  {
    id: "inexplicavel",
    title: "Design de Marca",
    meta: ["Inexplicável", "2025-2026"],
    link: "https://www.instagram.com/inexplicavelvinhos",
    body: [],
    children: [
      {
        id: "inexplicavel-identidade",
        title: "Identidade Visual",
        body: [
          "Concepção de ponta a ponta do ecossistema da marca e social media, desenvolvendo desde o logotipo tipográfico minimalista até a padronização da comunicação digital, com forte foco em hierarquia da informação e uso do espaço negativo.",
        ],
      },
      {
        id: "inexplicavel-embalagens",
        title: "Design de Embalagens e Prototipagem",
        body: [
          "Criação de rótulos de vinhos e desenvolvimento de mockups super realistas com sobreposições estéticas, garantindo que cada detalhe do produto (incluindo as visões completas e laterais das garrafas) fosse visualizado com alta precisão e fidelidade ao estilo visual proposto.",
        ],
      },
      {
        id: "inexplicavel-sistema",
        title: "Sistematização e Escalabilidade de Marca",
        body: [
          "Construção de um manual de identidade visual estruturado com base em metodologias e diretrizes de grandes corporações nacionais (como Vale e Oi), assegurando que o ecossistema da marca seja aplicável e escalável de forma consistente nos ambientes online e físico.",
        ],
      },
    ],
  },
  {
    id: "nova-tendencia",
    title: "Estágio & Dev Front-end Jr",
    meta: ["Nova Tendência", "2023-2024"],
    link: "https://portal-parceiros.cld.brasilseg.com.br/",
    body: [],
    children: [
      {
        id: "nova-tendencia-interfaces",
        title: "Desenvolvimento de Interfaces Complexas",
        body: [
          "Atuação na construção e manutenção do front-end do Portal de Parceiros da BB Seguros utilizando React.js, traduzindo regras de negócios do setor financeiro em telas funcionais e intuitivas.",
        ],
      },
      {
        id: "nova-tendencia-componentes",
        title: "Componentização e Escalabilidade",
        body: [
          "Criação de componentes reutilizáveis e estruturação de interfaces modulares, garantindo consistência visual e facilitando a manutenção do código por toda a equipe.",
        ],
      },
      {
        id: "nova-tendencia-evolucao",
        title: "Evolução Profissional",
        body: [
          "Ingresso como estagiário com rápida absorção da arquitetura do projeto e da stack tecnológica, resultando em efetivação para Desenvolvedor Júnior em apenas 7 meses, assumindo entregas de maior responsabilidade técnica.",
        ],
      },
    ],
  },
  {
    id: "fiocruz",
    title: "Iniciação Científica",
    meta: ["Fiocruz", "2022"],
    link: "https://journals.sagepub.com/doi/10.1177/00236772231194957",
    body: ["Artigo publicado na revista britânica Laboratory Animals."],
    children: [
      {
        id: "fiocruz-dados",
        title: "Engenharia de Dados e Matemática Aplicada",
        body: [
          "Desenvolvimento de um sistema e de um algoritmo próprio de randomização para automatizar e corrigir o cálculo de amostras biológicas em pesquisas de saúde.",
        ],
      },
      {
        id: "fiocruz-full-stack",
        title: "Desenvolvimento Full-Stack (Python)",
        body: [
          "Estruturação do back-end e da lógica matemática utilizando Flask, Pandas e NumPy para processar equações estatísticas complexas e entregá-las através de uma interface de fácil uso para pesquisadores não-técnicos.",
        ],
      },
      {
        id: "fiocruz-impacto",
        title: "Impacto Científico Internacional",
        body: [
          "A precisão do algoritmo e a solução desenvolvida mitigaram erros metodológicos críticos no instituto, resultando na publicação da metodologia em artigo na revista científica britânica Laboratory Animals.",
        ],
      },
    ],
  },
];

// --- PROJETO ------------------------------------------------------------------
// Mesma estrutura de Trabalho, com os textos da seção PROJETOS do CV.
// TODO: trocar o `link` pela URL do Maria.view.
const projects = [
  {
    id: "maria-view",
    title: "Maria.view",
    meta: ["10/2025 - atualmente"],
    link: "https://maria-view.onrender.com/#/login",
    body: [],
    children: [
      {
        id: "maria-view-3d",
        title: "Visualização Gráfica e Modelagem 3D",
        body: [
          "Desenvolvimento do Maria.view, uma aplicação web interativa voltada para a renderização e exploração tridimensional de estruturas moleculares complexas para uso direto pelos pesquisadores dos laboratórios de química da UFRJ.",
        ],
      },
      {
        id: "maria-view-interacao",
        title: "Interação Dinâmica e Lógica Matemática",
        body: [
          "Implementação de lógicas avançadas em JavaScript para a identificação interativa de átomos e execução em tempo real de cálculos físicos, incluindo medição de distâncias espaciais e a soma de cargas atômicas (como os métodos Mulliken e CHELPG).",
        ],
      },
      {
        id: "maria-view-ux",
        title: "UX/UI Aplicada à Ciência",
        body: [
          "Construção de uma interface focada na precisão e na usabilidade do pesquisador, com desenvolvimento de indicadores visuais de seleção (como marcações radiais em torno dos átomos interagidos) e painéis de dados responsivos, entregando uma ferramenta robusta e livre de falhas de execução para a análise de resultados científicos.",
        ],
      },
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
  { id: "trabalho", title: "Trabalho", children: works },
  { id: "projeto", title: "Projeto", children: projects },
  { id: "contato", title: "Contato", children: socials },
];
