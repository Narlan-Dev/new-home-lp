# Chá de Casa Nova — Luarnderson & Paty

Landing page de um chá de casa nova (informações do evento, programação, lista de presentes com reserva, FAQ, Pix e contato), implementada por engenharia reversa do design do Figma ([arquivo `kZXVLomBUH1YbLtjfu9eJi`](https://www.figma.com/design/kZXVLomBUH1YbLtjfu9eJi)) e organizada como o front-end da **cinova-portal**. A lista de presentes vem do **Firebase Realtime Database** e é mantida pelo casal numa área administrativa (`/admin`), sem back-end próprio.

## O que tem

| Seção do design               | Implementação                                                         |
| ----------------------------- | --------------------------------------------------------------------- |
| 1 · Hero (tela inteira)       | `sections/landing/Hero.tsx` (slideshow automático, setas, indicadores, menu) |
| 2 · Data, hora e local        | `sections/landing/EventInfo.tsx` (inclui **.ics** e link de mapa)     |
| 3 · Sobre                     | `sections/landing/About.tsx`                                          |
| 4 · Programação               | `sections/landing/Schedule.tsx`                                       |
| 5 · Presentes                 | `sections/landing/Gifts.tsx` + `sections/gifts/*` (lê do banco; modal de reserva) |
| 6 · Dúvidas                   | `sections/landing/Faq.tsx`                                            |
| 7 · Contribuição e contato    | `sections/landing/Contact.tsx` (Pix com "copiar chave", contatos)     |
| Fluxo "Reservar presente"     | formulário → confirmação, em modal (desktop) e tela cheia (mobile)    |
| **Área do casal** (`/admin`)  | `sections/admin/*`: login, lista com busca, cadastro, edição e exclusão de presentes |

Layouts de **1440 px (desktop)** e **390 px (mobile)** conforme o design; o ponto de troca é `md` = 1024 px.

## Requisitos e como rodar

- **Node 26 LTS** (fixado em `.nvmrc`; `nvm use`). O mínimo é Node `>=24.12.0` (`engines`), por causa do `@firebase/rules-unit-testing` 6; o `react-router` 8 pede `>=22.22.0`.
- **Yarn 4 via Corepack.** Do Node 25 em diante o Corepack não vem mais junto: `npm i -g corepack && corepack enable`.
- **Java 17+** só para os emuladores do Firebase e para os testes das regras.

```bash
nvm use
cp env.example .env   # preencha com a configuração do app Web do Firebase (veja "Banco de dados")
yarn install
yarn start            # http://localhost:3000
```

| Script                | O que faz                                                                   |
| --------------------- | --------------------------------------------------------------------------- |
| `yarn start`          | Servidor de desenvolvimento (Vite) ligado ao **banco real** do `.env`       |
| `yarn sandbox`        | **Sandbox**: sobe os emuladores, zera e popula (8 presentes + conta de teste) e abre o servidor de desenvolvimento ligado a eles |
| `yarn start:emulator` | Só o servidor de desenvolvimento contra os emuladores (`.env.emulator`); rode `yarn emulators` antes |
| `yarn build`          | Typecheck + build de produção em `dist/`                                    |
| `yarn preview`        | Serve o build de produção localmente                                        |
| `yarn typecheck`      | `tsc` em `src` e no `vite.config.mts`                                       |
| `yarn lint`           | ESLint (Prettier como aviso)                                                |
| `yarn lint:fix`       | ESLint com correção automática                                              |
| `yarn prettier`       | Formata `src/**/*.{ts,tsx}`                                                 |
| `yarn emulators`      | Sobe os emuladores de Realtime Database e Auth (projeto `demo-cha-casa-nova`) |
| `yarn test:rules`     | Testa as regras de segurança do banco no emulador (`tests/rules`)           |
| `yarn rules:deploy`   | Publica `database.rules.json` no projeto real (veja o checklist abaixo)     |
| `yarn firebase:backup` | Salva os dados do banco real em `backups/` (só lê); com `--restore <arquivo>` simula e, com `--apply`, restaura os presentes |
| `yarn firebase:seed`  | Cadastra os 8 presentes de exemplo (simulação por padrão; `--apply` grava)  |
| `yarn firebase:set-admin <e-mail>` | Dá (ou, com `--remove`, tira) o acesso de administrador a uma conta |

## Stack

React **19.3.1** · Vite 8 · TypeScript 6.0 (strict) · MUI 9 + Emotion · React Router 8 (data router, páginas lazy) · react-intl · TanStack Query 5 · sonner (toasts) · Firebase (Realtime Database pela REST, Auth sob demanda) · fontes DM Sans e Cormorant Garamond (`@fontsource`) · ESLint 10 + Prettier

## Banco de dados e área do casal (Firebase)

**Como funciona.** O navegador fala direto com o Firebase, sem back-end próprio:

- **Visitantes** só leem a lista de presentes, pela **API REST** do Realtime Database (`fetch`, sem conexão aberta e sem baixar o SDK do Firebase). O plano gratuito limita o banco a 100 conexões simultâneas; por isso não há WebSocket por visitante. A lista atualiza ao abrir a página e ao voltar para a aba (cache de 30 s).
- **O casal** entra em `/admin` com e-mail e senha (Firebase Auth). O SDK do Firebase é carregado **só nesse trecho** (chunks separados; confira com `yarn build`). As chamadas de escrita levam o token do login na REST.
- **Quem manda é o banco**, não a interface: as regras (`database.rules.json`) só deixam escrever quem consta em `/chaCasaNova/admins/<uid>`.

**Dados** (tudo sob o prefixo `/chaCasaNova`, para conviver com outros apps no mesmo banco):

```
/chaCasaNova/gifts/<id>     leitura pública · escrita só de administrador
    name (1–120) · price (0–1.000.000) · url (http/https) · image? (http/https) · order · reserved? · createdAt · updatedAt
/chaCasaNova/admins/<uid>   true · cada conta lê só o próprio registro · ninguém escreve pelo navegador
/chaCasaNova/reservations   negado (a reserva real é a próxima rodada)
```

`createdAt` e `updatedAt` são gravados pelo **relógio do servidor** (`{".sv": "timestamp"}`) e as regras recusam valores forjados, campos desconhecidos, preço negativo e links que não sejam http(s). `yarn test:rules` cobre isso com 26 casos (anônimo, conta comum, administrador, dados inválidos).

**Código** (segue o `framework/rest` da cinova-portal): `framework/rest/client/*` (`HttpClient` sobre `fetch`, `crudFactory`, `Client`, `QueryProvider`, tratamento de erros), hooks por recurso em `framework/rest/gifts.ts` (`useGifts`, `useGift`, `useCreateGiftMutation`, `useUpdateGiftMutation`, `useDeleteGiftMutation`) e `framework/rest/auth.ts` (login). O Auth é inicializado por `client/firebase.ts`, só quando a área do casal abre.

### Ambientes: onde testar

Não é preciso ter domínio nem hospedagem para testar: tudo roda em `localhost`.

| Ambiente | Como | Banco | Quando usar |
| -------- | ---- | ----- | ----------- |
| **Sandbox** (use no dia a dia) | `yarn sandbox` | Emuladores locais, zerados a cada início | Criar, editar e apagar à vontade, sem risco. Login de teste: `casal@exemplo.com` / `senha-12345` |
| **Local com o banco real** | `yarn start` | Projeto `arnexs` de verdade | Conferência final. O que você mudar aparece na lista real: faça `yarn firebase:backup` antes |
| Produção | `yarn build` + hospedagem | Projeto `arnexs` | Quando houver domínio (checklist abaixo) |

Uma **faixa no topo da área do casal** mostra em qual banco você está: **azul = sandbox**, **âmbar = banco real**. Ela só existe em desenvolvimento e **nunca aparece no site publicado** (build de produção). A landing pública não tem faixa.

O sandbox não toca no projeto real em nenhum momento (`sandbox-reset.mjs` só se conecta ao emulador) e os dados somem ao encerrar com Ctrl+C. Para um cenário próprio, rode `yarn emulators` e use `--emulator` nos scripts (`yarn firebase:set-admin <e-mail> --emulator --apply`, `yarn firebase:seed --emulator --apply`) junto com `yarn start:emulator`.

**Um segundo banco "de verdade"** (para homologar com Auth e regras reais) exigiria outro projeto Firebase (grátis, mas criado por você no console, com o app Web, o Realtime Database e o login por e-mail/senha) ou o plano Blaze (várias instâncias no mesmo projeto). Só compensa quando houver um ambiente hospedado de testes; até lá o sandbox em emulador cobre o mesmo comportamento das regras (`yarn test:rules`).

### Backup do banco real

O plano gratuito não faz backup automático do Realtime Database. Antes de mexer no banco real:

```bash
yarn firebase:backup                                          # salva backups/chaCasaNova-<data e hora>.json (só lê o banco)
yarn firebase:backup --restore backups/<arquivo>.json         # simulação: mostra o que voltaria a existir, sumiria ou mudaria
yarn firebase:backup --restore backups/<arquivo>.json --apply # troca TODOS os presentes pelos do arquivo
```

A restauração mexe só nos presentes (a lista de administradores nunca é restaurada por aqui; use `firebase:set-admin`) e recusa arquivos fora do formato do app. A pasta `backups/` fica fora do git.

### Checklist para publicar (uma vez)

1. **Console do Firebase → Authentication → Método de login:** habilite **E-mail/senha** e crie a conta do casal (Usuários → Adicionar usuário).
2. **Regras:** `firebase login` (com a conta Google dona do projeto) e `yarn rules:deploy`. Até isso ser feito o banco recusa todas as leituras e a landing mostra "Não conseguimos carregar a lista de presentes".
3. **Acesso de administrador:** `yarn firebase:set-admin <e-mail do casal>` (simulação) e de novo com `--apply`.
4. **Presentes de exemplo (opcional):** `yarn firebase:seed` e depois `--apply`. Troque os links `example.com` e inclua as fotos pelo painel em `/admin`.
5. **Só quando houver domínio de produção** — Authentication → Configurações → Domínios autorizados: acrescente o domínio (ex.: `casanova.arnexs.com`). Para testes locais isso não é preciso: `localhost` (em qualquer porta) já vem liberado.
6. **Recomendado, também só com domínio:** no Google Cloud Console (APIs e serviços → Credenciais), restrinja a chave de API do app Web por referenciador HTTP ao domínio de produção e a `localhost`. A chave do app Web é pública por natureza; a restrição só reduz abuso.
7. Faça o build com o `.env` de produção (`yarn build`) e publique `dist/`.

### Segredos

| O que                                              | Onde fica                                                                                  |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------ |
| Configuração do app Web (apiKey, appId...)         | `.env` (ignorado pelo git; são identificadores públicos, a proteção vem das regras)        |
| **Chave do Admin SDK** (ignora as regras!)         | **Fora do repositório**: `~/.config/arnexs/serviceAccount.json` (modo 600). Só os scripts de `scripts/firebase/` a leem; nunca `src/` nem o navegador. O `.gitignore` bloqueia `*firebase-adminsdk*.json` e `serviceAccount*.json` |
| Token do Figma                                     | `.figma-token` (ignorado)                                                                  |

Se a chave do Admin SDK chegou a ser compartilhada ou versionada em algum lugar, gere outra no console (Configurações do projeto → Contas de serviço) e apague a antiga.

## Como personalizar (troque os dados de exemplo do design)

| O que                                                          | Onde                                    |
| -------------------------------------------------------------- | --------------------------------------- |
| Nomes do casal (`first`/`second`; `names` e `initials` são derivados), data/hora e endereço | `src/constants/event.ts` |
| Telefone/WhatsApp, e-mail, Instagram e chave Pix               | `src/constants/contact.ts`              |
| **Presentes** (nome, preço, link da loja, foto e posição)      | Painel do casal, em `/admin`            |
| Quantos presentes aparecem antes de "Ver mais presentes"       | `GIFTS_PREVIEW_COUNT` em `src/constants/gifts.ts` |
| Fotos do slideshow do hero (basta colocar os arquivos na pasta; a ordem é a do nome) | `src/assets/images/hero/` |
| Intervalo do slideshow                                         | `HERO_AUTOPLAY_MS` em `src/constants/hero.ts` |
| Foto da seção "Sobre"                                          | `ABOUT_PHOTO` em `src/constants/event.ts` |
| Horários da programação                                        | `src/constants/schedule.ts`             |
| **Todos os textos** (títulos, descrições, FAQ, painel)         | `src/utils/locales/pt-br.json`          |
| Cores, tipografia e componentes do tema                        | `src/themes/*`                          |

Observações:

- Enquanto não houver fotos, a página mostra os placeholders do design (gradientes no hero — variações do mesmo tom, para a troca de slides ser visível —, caixas azuladas nas demais). A dica "Foto 1 de 3 — substitua pelas fotos do casal" **some sozinha** quando houver fotos em `src/assets/images/hero/` (jpg, png, webp ou avif).
- O **título do hero** mostra os nomes em duas linhas ("Luarnderson" / "& Paty"): a primeira linha tem a mesma largura do "Ana & Lucas" do design, então o bloco ocupa o mesmo espaço e o tamanho acompanha a tela. Com a prefers-reduced-motion ativa no sistema, o slideshow não avança sozinho (de propósito).
- O telefone, o e-mail e a chave Pix são os valores fictícios do design. O mesmo vale para os links dos presentes de exemplo (`https://example.com/link-do-presente`).
- A foto de cada presente é um **link** de imagem (`https://...`); se o link não carregar, aparece o placeholder do design. Enviar arquivos exigiria o Firebase Storage (plano Blaze).

## ⚠️ Reserva de presentes ainda não grava nada

A lista de presentes é real, mas a **reserva continua simulada**: `src/framework/rest/reservations.ts` (`reserveGift`) só espera 500 ms e devolve um id. O formulário valida e mostra a confirmação, porém nada é salvo nem enviado ao casal, o presente não fica marcado como reservado e a mensagem "Enviamos a confirmação para o seu WhatsApp" ainda não é verdadeira. O próximo passo é gravar em `/chaCasaNova/reservations` (regras próprias: convidado só cria, uma vez, em presente existente e não reservado) e marcar `reserved` no presente — a interface já mostra o selo "Reservado" e desabilita o botão quando `reserved` for `true`.

## Animações

As seções surgem conforme a rolagem, cada uma com a sua coreografia (`src/components/Reveal.tsx` + `src/hooks/useInView.ts`, sem biblioteca extra, só CSS e um `IntersectionObserver` único):

| Seção                  | Animação                                                                                          |
| ---------------------- | ------------------------------------------------------------------------------------------------- |
| Hero                   | Entrada em cascata ao carregar (menu → eyebrow → cada linha do nome → texto → data → botões → controles) |
| Cabeçalhos de seção    | Eyebrow, título e texto sobem em sequência                                                        |
| Evento                 | Colunas em sequência, ícones "estouram" com leve overshoot e as divisórias se desenham            |
| Sobre                  | Foto em arco sobe revelando-se como uma cortina; o texto entra em cascata                         |
| Programação            | Itens em sequência, marcadores "estouram" e a linha do tempo se desenha                           |
| Presentes              | Cards sobem em sequência (esquerda → direita)                                                     |
| Dúvidas                | Texto lateral em cascata e perguntas subindo uma a uma                                            |
| Contribuição e contato | Cartões sobem, QR code "estoura", contatos deslizam e os créditos aparecem por último             |

Só os elementos que aparecem juntos entram em sequência (quem entra sozinho não espera). Para animar algo novo: `<Reveal variant="up" delay={100} group="meu-grupo" stagger={90}>…</Reveal>` (variantes: `fade`, `up`, `left`, `right`, `scale`, `pop`, `draw-x`, `draw-y`, `curtain`). Com `prefers-reduced-motion` ativo, tudo aparece na hora, sem movimento.

## Comportamentos que o design não especifica (decisões tomadas)

- **Hero em tela cheia:** ocupa exatamente a altura da tela ao abrir (`100svh`, com mínimo para telas muito baixas); a seção "Evento" só aparece ao rolar.
- **FAQ:** todas as respostas abertas por padrão (como no design), cada item pode ser recolhido; o ícone "+" é fixo, como desenhado.
- **"Ver mais presentes":** só aparece quando há mais presentes do que cabem na prévia (`GIFTS_PREVIEW_COUNT`, hoje 8); ao clicar, expande para a lista completa e some. Com 8 itens ou menos não há nada extra a mostrar, então o botão não aparece.
- **Carregando, erro e lista vazia:** a seção de presentes mostra esqueletos de cartão enquanto a lista chega, uma mensagem com "Tentar de novo" se falhar e um aviso amigável se ainda não houver presentes.
- **"Confirmar presença" e "Falar no WhatsApp":** abrem o WhatsApp com mensagem pronta (o FAQ diz "pelo botão no topo ou direto no WhatsApp").
- **Cabeçalho:** não é fixo (rola com a página), como no design; no mobile o menu abre em uma gaveta lateral.
- **Campos:** estados de foco, erro e carregamento foram criados no mesmo estilo do design.
- **Área do casal:** não existe no design; usa os mesmos tokens, tipografia e botões da landing e fica fora dos buscadores (`noindex`).
- **Larguras intermediárias** (entre 390 e 1440): o layout mobile vai até 1023 px e o desktop reduz proporcionalmente abaixo de 1440 px.

## Como o design foi lido e verificado

O MCP do Figma (plano Starter) bloqueou por limite de uso, então o arquivo foi lido pela **API REST** com um token pessoal em `.figma-token` (ignorado pelo git; revogue-o no Figma quando não precisar mais). O JSON e os PNGs dos frames ficam em `design/` (também ignorado, regenerável).

Verificação feita contra o design (antes de trocar os nomes e de o hero ocupar a tela inteira): cada texto do Figma (114 no desktop, 108 no mobile) foi pareado com o elemento do DOM e comparado em posição e tamanho — desvio médio de **0,25 px (desktop)** e **1,2 px (mobile)**, sem nenhum texto do desktop acima de 2 px —, além de diff de pixels por seção (< 1 % no desktop). Desde então, o hero (título em duas linhas) e textos mais longos do casal (chave Pix, assinatura) mudam o layout de propósito. Também há testes de ponta a ponta do fluxo de reserva, slideshow, menu, FAQ, Pix, calendário, rotas, animações e, agora, de **toda a área do casal contra os emuladores do Firebase** (login, barreira de acesso, cadastro, edição, exclusão, permissão negada, esqueleto/erro/vazio da landing). Esses scripts ficam em `design/tools/` (local, ignorado pelo git; exigem Chrome, `yarn emulators` e um build servido na porta 4173).

## Estrutura (segue a cinova-portal)

| Pasta                    | Papel                                                                                         |
| ------------------------ | --------------------------------------------------------------------------------------------- |
| `src/pages`              | Uma página por rota; `landing.tsx` compõe as seções e `admin/*` são as páginas da área do casal |
| `src/sections`           | UI por funcionalidade: `landing/*` (seções), `gifts/*` (card, modal e formulário de reserva) e `admin/*` (login, lista e formulário de presentes) |
| `src/components`         | Reutilizáveis: `@extended` (campo, foto), `modal` (confirmação), `ErrorState`, `Section`, `SectionHeader`, `pages/Header` e `pages/EnvironmentBanner` (faixa azul/âmbar só em desenvolvimento) |
| `src/layout`             | Layouts de rota (`Simple` para a landing, `Admin` para a área do casal)                       |
| `src/routes`             | `createBrowserRouter` com páginas `lazy` + `Loadable`; `AdminRoutes.tsx` separa a área do casal |
| `src/themes`             | Tema MUI: tokens do Figma (`theme/default.ts`), paleta, tipografia e `overrides/*`            |
| `src/framework/rest`     | Acesso a dados: cliente do Realtime Database, hooks do React Query, login e a reserva simulada |
| `src/contexts`, `src/utils/route-guard` | Login (`AuthProvider`) e barreiras de rota (`AdminGuard`, `GuestGuard`)        |
| `src/constants`, `src/types`, `src/utils`, `src/hooks`, `src/config.ts` | Dados, tipos, utilitários e hooks               |
| `src/assets/icons`       | Ícones exportados do Figma como componentes (`currentColor`) e os do painel                   |
| `src/utils/locales`      | Textos da interface (`pt-br.json`) consumidos por react-intl                                  |
| `database.rules.json`, `firebase.json`, `.firebaserc` | Regras de segurança e configuração dos emuladores/deploy             |
| `tests/rules`            | Testes das regras de segurança (`node:test` + `@firebase/rules-unit-testing`)                 |
| `scripts/firebase`       | Scripts com o Admin SDK: `seed-gifts`, `set-admin`, `backup` (simulação por padrão) e `sandbox-reset` (só emulador) |

Convenções: imports absolutos a partir de `src` (`import config from 'config'`), grupos de import comentados (`// material-ui`, `// third-party`, `// project-imports`, `// assets`, `// types`), banner `// ====|| NOME ||==== //` e `export default` por componente, todo texto via `SafeFormattedMessage`, Prettier com 140 colunas.

> **Armadilha do tema:** as variantes tipográficas definem `fontSize`/`lineHeight` também dentro de `@media` em `md`. Ao sobrescrever esses valores com `sx`, informe **os dois breakpoints** (`{ xs: …, md: … }`); um valor simples perde para o `@media` da variante.

## Diferenças em relação à cinova-portal

- **Sem back-end próprio:** o `framework/rest` fala com o Firebase Realtime Database pela REST (`fetch`, não axios); `crudFactory`, `Client`, `query-keys` e os hooks por recurso seguem o mesmo molde. Autenticação é o Firebase Auth (e-mail/senha), carregado sob demanda, e a permissão vem da lista `/admins` conferida pelas regras do banco.
- **`useConfirm` sem jotai:** mesma forma de uso (`await confirm({ ... })`), implementada com um contexto leve (`components/modal/ConfirmProvider.tsx`).
- **Removido por não se aplicar a esta landing:** CASL, jotai, customizador de tema, RTL, layouts de dashboard, métricas, tempo real (`RealtimeBridge`).
- **Sem `ConfigProvider`/localStorage:** `config.ts` é estático.
- **Sem `vite-tsconfig-paths`:** o Vite 8 resolve `paths` do tsconfig nativamente (`resolve.tsconfigPaths`).
- **React 19 idiomático:** `Locales` usa `use()` + `Suspense`, o slideshow usa `useEffectEvent`, `StrictMode` ligado.
- **`react-router` único:** importado de `react-router` (e `RouterProvider` de `react-router/dom`), sem `react-router-dom`.
- **Yarn com `nodeLinker: node-modules`** (a cinova-portal usa PnP).
- **Sem Formik/Yup:** os formulários usam estado do React e validação própria (`ReserveGiftForm.schema.ts`, `GiftForm.schema.ts`).

## Notas de versões

- **TypeScript 6.0.3, não 7.x:** `typescript-eslint` declara suporte a `typescript <6.1.0`.
- **`@vitejs/plugin-react` 6.1.2, não 6.2.x:** o Yarn 4.18 bloqueia ("quarantined") versões publicadas há menos de 24 h (`npmMinimalAgeGate`); pode ser atualizado depois sem desligar essa proteção. O mesmo vale para as versões fixadas de `firebase` (13.1.0), `@tanstack/react-query` e `sonner`.
- **`firebase-tools` 14.27.0, não 15.x:** a 15 recusa Java anterior ao 21; a 14.27 sobe os emuladores com Java 17 (só avisa). Se instalar o JDK 21, dá para atualizar.
- **`@types/node` 26:** alinhado ao Node 26 do runtime.

## `cinova-portal/` dentro deste repositório

Cópia local, com `.git` próprio, usada apenas como referência de arquitetura. Está no `.gitignore` e no `globalIgnores` do ESLint; não faz parte do projeto.
