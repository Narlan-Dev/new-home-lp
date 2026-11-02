# Chá de Casa Nova — Ana & Lucas

Landing page de um chá de casa nova (informações do evento, programação, lista de presentes com reserva, FAQ, Pix e contato), implementada por engenharia reversa do design do Figma ([arquivo `kZXVLomBUH1YbLtjfu9eJi`](https://www.figma.com/design/kZXVLomBUH1YbLtjfu9eJi)) e organizada como o front-end da **cinova-portal**.

## O que tem

| Seção do design               | Implementação                                                         |
| ----------------------------- | --------------------------------------------------------------------- |
| 1 · Hero                      | `sections/landing/Hero.tsx` (slideshow, setas, indicadores, menu)     |
| 2 · Data, hora e local        | `sections/landing/EventInfo.tsx` (inclui **.ics** e link de mapa)     |
| 3 · Sobre                     | `sections/landing/About.tsx`                                          |
| 4 · Programação               | `sections/landing/Schedule.tsx`                                       |
| 5 · Presentes                 | `sections/landing/Gifts.tsx` + `sections/gifts/*` (modal de reserva)  |
| 6 · Dúvidas                   | `sections/landing/Faq.tsx`                                            |
| 7 · Contribuição e contato    | `sections/landing/Contact.tsx` (Pix com "copiar chave", contatos)     |
| Fluxo "Reservar presente"     | formulário → confirmação, em modal (desktop) e tela cheia (mobile)    |

Layouts de **1440 px (desktop)** e **390 px (mobile)** conforme o design; o ponto de troca é `md` = 1024 px.

## Requisitos e como rodar

- Node `>=22.22.0` (exigência do `react-router` 8) e Yarn 4 via Corepack (`corepack enable`).

```bash
cp env.example .env   # opcional: só define o caminho base de publicação
yarn install
yarn start            # http://localhost:3000
```

| Script           | O que faz                                      |
| ---------------- | ---------------------------------------------- |
| `yarn start`     | Servidor de desenvolvimento (Vite)             |
| `yarn build`     | Typecheck + build de produção em `dist/`       |
| `yarn preview`   | Serve o build de produção localmente           |
| `yarn typecheck` | `tsc` em `src` e no `vite.config.mts`          |
| `yarn lint`      | ESLint (Prettier como aviso)                   |
| `yarn lint:fix`  | ESLint com correção automática                 |
| `yarn prettier`  | Formata `src/**/*.{ts,tsx}`                    |

## Stack

React **19.3.1** · Vite 8 · TypeScript 6.0 (strict) · MUI 9 + Emotion · React Router 8 (data router, páginas lazy) · react-intl · fontes DM Sans e Cormorant Garamond (`@fontsource`) · ESLint 10 + Prettier

## Como personalizar (troque os dados de exemplo do design)

| O que                                                          | Onde                                    |
| -------------------------------------------------------------- | --------------------------------------- |
| Nomes do casal, data/hora e endereço                           | `src/constants/event.ts`                |
| Telefone/WhatsApp, e-mail, Instagram e chave Pix               | `src/constants/contact.ts`              |
| Presentes (preço, link da loja e foto)                         | `src/constants/gifts.ts`                |
| Fotos do slideshow do hero                                     | `src/constants/hero.ts`                 |
| Foto da seção "Sobre"                                          | `ABOUT_PHOTO` em `src/constants/event.ts` |
| Horários da programação                                        | `src/constants/schedule.ts`             |
| **Todos os textos** (títulos, descrições, FAQ, nomes dos presentes) | `src/utils/locales/pt-br.json`     |
| Cores, tipografia e componentes do tema                        | `src/themes/*`                          |

Observações:

- Enquanto não houver fotos, a página mostra os placeholders do design (gradiente no hero, caixas azuladas nas demais). A dica "Foto 1 de 3 — substitua pelas fotos do casal" **some sozinha** quando todos os slides em `constants/hero.ts` tiverem `image`.
- Os links dos presentes (`https://example.com/link-do-presente`), o telefone, o e-mail e a chave Pix são os valores fictícios do design.
- O texto dos presentes é buscado por `landing.gifts.items.<id>`; ao adicionar um presente em `constants/gifts.ts`, adicione também o nome no JSON.

## ⚠️ Reserva de presentes ainda não grava nada

O design traz o fluxo de reserva, mas não define para onde os dados vão. Por isso `src/framework/rest/gifts.ts` (`reserveGift`) **apenas simula** o envio: o formulário valida e mostra a confirmação, porém nada é salvo nem enviado ao casal, e a mensagem "Enviamos a confirmação para o seu WhatsApp" ainda não é verdadeira. Troque o corpo da função por uma chamada real (API, planilha, WhatsApp...) quando o destino for decidido; a interface não precisa mudar.

## Comportamentos que o design não especifica (decisões tomadas)

- **FAQ:** todas as respostas abertas por padrão (como no design), cada item pode ser recolhido; o ícone "+" é fixo, como desenhado.
- **"Ver mais presentes":** expande para a lista completa e some; com os 8 itens atuais não há nada extra a mostrar.
- **"Confirmar presença" e "Falar no WhatsApp":** abrem o WhatsApp com mensagem pronta (o FAQ diz "pelo botão no topo ou direto no WhatsApp").
- **Cabeçalho:** não é fixo (rola com a página), como no design; no mobile o menu abre em uma gaveta lateral.
- **Campos:** estados de foco, erro e carregamento foram criados no mesmo estilo do design.
- **Larguras intermediárias** (entre 390 e 1440): o layout mobile vai até 1023 px e o desktop reduz proporcionalmente abaixo de 1440 px.

## Como o design foi lido e verificado

O MCP do Figma (plano Starter) bloqueou por limite de uso, então o arquivo foi lido pela **API REST** com um token pessoal em `.figma-token` (ignorado pelo git; revogue-o no Figma quando não precisar mais). O JSON e os PNGs dos frames ficam em `design/` (também ignorado, regenerável).

Verificação feita contra o design: cada texto do Figma (114 no desktop, 108 no mobile) foi pareado com o elemento do DOM e comparado em posição e tamanho — desvio médio de **0,25 px (desktop)** e **1,2 px (mobile)**, sem nenhum texto do desktop acima de 2 px —, além de diff de pixels por seção (< 1 % no desktop) e teste de ponta a ponta do fluxo de reserva, slideshow, menu, FAQ, Pix, calendário e rotas.

## Estrutura (segue a cinova-portal)

| Pasta                    | Papel                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `src/pages`              | Uma página por rota; `landing.tsx` compõe as seções                                           |
| `src/sections`           | UI por funcionalidade: `landing/*` (seções) e `gifts/*` (card, modal e formulário de reserva) |
| `src/components`         | Reutilizáveis: `@extended` (campo, foto), `Section`, `SectionHeader`, `pages/Header`          |
| `src/layout`             | Layouts de rota                                                                               |
| `src/routes`             | `createBrowserRouter` com páginas `lazy` + `Loadable`                                         |
| `src/themes`             | Tema MUI: tokens do Figma (`theme/default.ts`), paleta, tipografia e `overrides/*`            |
| `src/framework/rest`     | Acesso a dados (hoje só a reserva simulada)                                                   |
| `src/constants`, `src/types`, `src/utils`, `src/hooks`, `src/config.ts` | Dados, tipos, utilitários e hooks               |
| `src/assets/icons`       | Ícones exportados do Figma como componentes (`currentColor`)                                  |
| `src/utils/locales`      | Textos da interface (`pt-br.json`) consumidos por react-intl                                  |

Convenções: imports absolutos a partir de `src` (`import config from 'config'`), grupos de import comentados (`// material-ui`, `// third-party`, `// project-imports`, `// assets`, `// types`), banner `// ====|| NOME ||==== //` e `export default` por componente, todo texto via `SafeFormattedMessage`, Prettier com 140 colunas.

> **Armadilha do tema:** as variantes tipográficas definem `fontSize`/`lineHeight` também dentro de `@media` em `md`. Ao sobrescrever esses valores com `sx`, informe **os dois breakpoints** (`{ xs: …, md: … }`); um valor simples perde para o `@media` da variante.

## Diferenças em relação à cinova-portal

- **Removido por não se aplicar a uma landing:** autenticação, CASL, React Query, customizador de tema, RTL, layouts de dashboard, métricas.
- **Sem `ConfigProvider`/localStorage:** `config.ts` é estático.
- **Sem `vite-tsconfig-paths`:** o Vite 8 resolve `paths` do tsconfig nativamente (`resolve.tsconfigPaths`).
- **React 19 idiomático:** `Locales` usa `use()` + `Suspense`, o slideshow usa `useEffectEvent`, `StrictMode` ligado.
- **`react-router` único:** importado de `react-router` (e `RouterProvider` de `react-router/dom`), sem `react-router-dom`.
- **Yarn com `nodeLinker: node-modules`** (a cinova-portal usa PnP).
- **Sem Formik/Yup:** o formulário (5 campos) usa estado do React e uma validação própria em `ReserveGiftForm.schema.ts`.

## Notas de versões

- **TypeScript 6.0.3, não 7.x:** `typescript-eslint` declara suporte a `typescript <6.1.0`.
- **`@vitejs/plugin-react` 6.1.2, não 6.2.x:** o Yarn 4.18 bloqueia ("quarantined") versões publicadas há menos de 24 h (`npmMinimalAgeGate`); pode ser atualizado depois sem desligar essa proteção.
- **`@types/node` 22:** alinhado ao Node 22 do runtime.

## `cinova-portal/` dentro deste repositório

Cópia local, com `.git` próprio, usada apenas como referência de arquitetura. Está no `.gitignore` e no `globalIgnores` do ESLint; não faz parte do projeto.
