# Graph Report - EuSouTT  (2026-10-23)

## Corpus Check
- 15 files · ~32,865 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 125 nodes · 155 edges · 11 communities
- Extraction: 90% EXTRACTED · 8% INFERRED · 2% AMBIGUOUS · INFERRED: 12 edges (avg confidence: 0.86)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `99fa3fa9`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- Menu.jsx
- devDependencies
- package.json
- React + Vite Template Setup
- Alia Brand Mark (favicon.svg)
- Showcase.jsx
- content.js
- EuSouTT — Portfólio de Matheus Araripe
- AnchorDot.jsx

## God Nodes (most connected - your core abstractions)
1. `EuSouTT — Portfólio de Matheus Araripe` - 7 edges
2. `React + Vite Template Setup` - 6 edges
3. `scripts` - 5 edges
4. `AnchorDot()` - 5 edges
5. `Menu()` - 5 edges
6. `index.html (Vite entry document)` - 5 edges
7. `Matheus Araripe Front-end & Design Portfolio` - 4 edges
8. `Hot Module Replacement (HMR)` - 4 edges
9. `ESLint Configuration Expansion` - 4 edges
10. `App()` - 3 edges

## Surprising Connections (you probably didn't know these)
- `Matheus Araripe Front-end & Design Portfolio` --conceptually_related_to--> `ESLint Configuration Expansion`  [AMBIGUOUS]
  index.html → README.md
- `Matheus Araripe Front-end & Design Portfolio` --conceptually_related_to--> `React Compiler (disabled)`  [AMBIGUOUS]
  index.html → README.md
- `index.html (Vite entry document)` --implements--> `React + Vite Template Setup`  [INFERRED]
  index.html → README.md
- `/src/main.jsx module script tag` --conceptually_related_to--> `Hot Module Replacement (HMR)`  [INFERRED]
  index.html → README.md
- `App()` --calls--> `slideOf()`  [EXTRACTED]
  src/App.jsx → src/data/slides.js

## Import Cycles
- None detected.

## Hyperedges (group relationships)
- **Masked Gradient Rendering Pipeline (silhouette path, alpha mask, blurred ellipse mesh, palette)** — public_favicon_zigzag_arrow_glyph, public_favicon_mask_clipped_gradient, public_favicon_blurred_ellipse_mesh, public_favicon_violet_palette [EXTRACTED 1.00]
- **Interchangeable React transform/compiler toolchain options** — readme_vitejs_plugin_react, readme_vitejs_plugin_react_swc, readme_react_compiler, readme_hmr [EXTRACTED 1.00]
- **Static discoverability and branding surface of the portfolio** — index_seo_metadata, index_theming_favicon, index_portfolio_matheus_araripe, index_html_document [INFERRED 0.85]
- **Vite React app bootstrap flow (HTML shell to mounted SPA)** — index_html_document, index_main_module_script, index_root_mount_node, readme_react_vite_template [INFERRED 0.85]

## Communities (11 total, 0 thin omitted)

### Community 0 - "Menu.jsx"
Cohesion: 0.18
Nodes (12): ArrowBack(), ArrowOut(), Spark(), boxStyle(), clamp(), Item(), Menu(), opens() (+4 more)

### Community 1 - "devDependencies"
Cohesion: 0.09
Nodes (23): eslint, @eslint/js, eslint-plugin-react-hooks, eslint-plugin-react-refresh, globals, devDependencies, eslint, @eslint/js (+15 more)

### Community 2 - "package.json"
Cohesion: 0.13
Nodes (14): dependencies, react, react-dom, name, private, scripts, build, dev (+6 more)

### Community 3 - "React + Vite Template Setup"
Cohesion: 0.23
Nodes (14): index.html (Vite entry document), /src/main.jsx module script tag, Matheus Araripe Front-end & Design Portfolio, #root SPA mount node, SEO and Open Graph Metadata, SVG favicon and white theme-color, ESLint Configuration Expansion, Hot Module Replacement (HMR) (+6 more)

### Community 4 - "Alia Brand Mark (favicon.svg)"
Cohesion: 0.31
Nodes (9): Alia Brand Mark (favicon.svg), Blurred Ellipse Mesh (feGaussianBlur Layers), Display-P3 Wide-Gamut Color Fallback, Duplicated Base Path vs Mask Path (0.104 X-Offset), Figma Export Artifact (effect1_foregroundBlur_2002_17158), Alpha-Mask Clipped Gradient Fill, Static Site Identity Asset (public/ favicon), Violet / Cyan Brand Palette (#863bff, #7e14ff, #ede6ff, #47bfff) (+1 more)

### Community 6 - "Showcase.jsx"
Cohesion: 0.20
Nodes (6): App(), pad(), Showcase(), menu, slideOf(), slides

### Community 7 - "content.js"
Cohesion: 0.25
Nodes (7): inexplicavelMedia, mariaEulaliaMedia, mariaViewMedia, projects, socials, ulissesMedia, works

### Community 11 - "EuSouTT — Portfólio de Matheus Araripe"
Cohesion: 0.17
Nodes (11): Arquitetura, Comandos, Convenções do projeto, Deploy, EuSouTT — Portfólio de Matheus Araripe, Git, graphify, Mantendo este arquivo vivo (+3 more)

### Community 15 - "AnchorDot.jsx"
Cohesion: 0.27
Nodes (9): AnchorDot(), clamp01(), easeOut(), FOLLOW, GROW, JELLY, lerp(), PILL (+1 more)

## Ambiguous Edges - Review These
- `Matheus Araripe Front-end & Design Portfolio` → `ESLint Configuration Expansion`  [AMBIGUOUS]
  README.md · relation: conceptually_related_to
- `Matheus Araripe Front-end & Design Portfolio` → `React Compiler (disabled)`  [AMBIGUOUS]
  index.html · relation: conceptually_related_to
- `Static Site Identity Asset (public/ favicon)` → `Display-P3 Wide-Gamut Color Fallback`  [AMBIGUOUS]
  public/favicon.svg · relation: conceptually_related_to

## Knowledge Gaps
- **45 isolated node(s):** `name`, `private`, `version`, `type`, `dev` (+40 more)
  These have ≤1 connection - possible missing edges or undocumented components. (Counts symbols only; 56 node(s) total have ≤1 connection when file, concept and rationale nodes are included.)

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **What is the exact relationship between `Matheus Araripe Front-end & Design Portfolio` and `ESLint Configuration Expansion`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Matheus Araripe Front-end & Design Portfolio` and `React Compiler (disabled)`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **What is the exact relationship between `Static Site Identity Asset (public/ favicon)` and `Display-P3 Wide-Gamut Color Fallback`?**
  _Edge tagged AMBIGUOUS (relation: conceptually_related_to) - confidence is low._
- **Why does `devDependencies` connect `devDependencies` to `package.json`?**
  _High betweenness centrality (0.072) - this node is a cross-community bridge._
- **What connects `name`, `private`, `version` to the rest of the system?**
  _45 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `devDependencies` be split into smaller, more focused modules?**
  _Cohesion score 0.08695652173913043 - nodes in this community are weakly interconnected._
- **Should `package.json` be split into smaller, more focused modules?**
  _Cohesion score 0.13333333333333333 - nodes in this community are weakly interconnected._