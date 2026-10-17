# DH Gestão — contexto e decisões

Estado em 2026-10-17. Fases 1 a 5 do `PLANO.md` **concluídas e publicadas**.

## Estado atual (implementado, testado e publicado)
- **Site:** https://dhgest.lucast.app (domínio do usuário `lucast.app`, no DNS da Cloudflare; ligado em 2026-10-17 por `routes` com `custom_domain` no `wrangler.jsonc`) e, mantido ligado de propósito (`workers_dev: true`), o endereço antigo https://dh-gestao.doce-agenda-local.workers.dev que o Marcos já recebeu. Cloudflare Workers Static Assets, `noindex`. Verificado no endereço real: cabeçalhos, manifest, ícones e os 22 testes de tela rodados contra o link publicado, em 360 e 1280 px.
- **Repositório:** https://github.com/tenorio94-prog/dh-gestao-demo (privado), `main`.
- **App:** `app/` (Vite + React + TypeScript + Tailwind, Zustand, React Router em hash). Telas: Hoje (resumo, filtros, cartões, novo agendamento, cobrança), Estoque (alertas, ajuste, pedido por WhatsApp, registrar chegada), Meu mês.
- **Verificação:** `cd app && npm run check` = tipos + lint + 19 testes unitários + build + 22 testes de tela. Tudo verde.
- **Deploy:** `cd app && npm run deploy`.
- **Não feito / desvios do plano:** Codex não foi usado nesta construção (escopo pequeno, preferi escrever direto); teste de ImageGen não foi feito (logo em SVG próprio); os arquivos órfãos do scaffold do Vite (`app/README.md`, `app/public/icons.svg`) e `.tmp-scripts/` foram apagados em 2026-10-17 (`src/assets/` e `src/App.css` já não existiam).
- **Para quem o link vai (a landing também é pública, com noindex):** é público para quem tiver o endereço (sem login). O subdomínio `doce-agenda-local.workers.dev` é o da conta; trocar exigiria domínio próprio.

## Decisões tomadas
| Decisão | Escolha | Motivo / observação |
|---|---|---|
| Produto | Demo de gestão para lava jato, mostrada por link no celular | Ferramenta de conversa com o dono da indústria (Marcos) e com donos de lava jato; **não é produto validado** |
| Nome | **DH Gestão** | Escolhido pelo usuário. Falta checar se já existe produto com o mesmo nome |
| Marca | Identidade e posicionamento criados do zero | Projeto, não empresa. Sem logo/cores/nome da DH Limp sem autorização |
| Escopo | Duas partes: agenda de lavagens + consumo e reposição de produto | Reposição liga o lava jato à indústria |
| Stack | **Vite + React + TypeScript + Tailwind CSS**, estático, dados locais | Recomendação do Sonnet; os modelos escrevem melhor essa stack. O Doce Agenda (HTML/JS puro, `app.js` de ~200 KB) ficou difícil de manter. Alternativas descartadas: Svelte, Next.js |
| Hospedagem | Cloudflare, conta do usuário | Login é interativo e feito por ele; publicar só com autorização |
| Modelos | Sonnet principal; Opus consultor; Codex Sol medium para tarefas fechadas | Hipótese em teste, ver `AGENTS.md` |
| Imagens | Referência visual via Google Stitch (prompt já entregue); ilustrações via ChatGPT/Codex só sob pedido | Imagem no Codex gasta o saldo de código |

## Rodada 2: landing, desktop e acabamento (2026-10-17)
- **Rotas:** `/` é a landing; `/app`, `/app/estoque`, `/app/mes` são o aplicativo (BrowserRouter; o fallback de SPA da Cloudflare já cobre links diretos). Links antigos `/#/estoque` e `/#/mes` são redirecionados para `/app/...` em `main.tsx`. `start_url` do manifest passou a `/app`. Rota desconhecida volta para `/`.
- **Landing** (`app/src/landing/Landing.tsx`, carregada sob demanda): título em Unbounded (letreiro) + Plus Jakarta Sans; abertura com capturas reais do app (`public/landing/`, geradas por `scripts/capture-landing.mjs`); três blocos de funcionalidade alternados; **calculadora "Quantos dias dura o seu produto?"** que usa as mesmas funções `daysRemaining`/`stockLevel` do app; seção honesta "Ainda é um experimento". Sem depoimentos, números ou promessas inventadas. Uma única animação de entrada (abertura).
- **Desktop (>= 1024 px):** casca própria com barra lateral (avisos: carros para cobrar e produtos críticos), **quadro por etapa** (Aguardando, Lavando, Pronto, Pago) com contagem e total por coluna, faixa de 4 indicadores, painel lateral no lugar da folha de baixo, aviso de "Desfazer" no canto. Celular continua com lista priorizada, folha de baixo e abas.
- **Meu mês:** gráfico "Vendido por dia" (função `dailySales`, escrita em TDD pelo Codex; tabela equivalente para leitores de tela). Rótulo "A receber" virou "A cobrar" também aqui, para o mesmo termo em todo o app.
- **Acabamento:** rótulos em caixa-alta e numeração do formulário removidos; botões do quadro empilhados em coluna estreita; cabeçalho da landing no celular sem sobreposição.
- **Testes:** `npm run check` (tipos, lint, 27 unitários, build, Playwright 360 e 1280 px incluindo a11y de app e landing). Capturas para documentação: `docs/capturas/` (`app/scripts/capture-docs.mjs`).
- **Descoberto no caminho:** `<table class="sr-only">` não recorta (a tabela estourava a largura no celular); precisa de um `<div class="sr-only">` por fora. O `init` do shadcn continua descartado.

## Rodada de evolução (2026-10-17, com subagentes)
Auditoria sob 5 ângulos (produto, visual, UX, acessibilidade, engenharia). Decisões e motivos:
- **Prioridade operacional na lista de Hoje** (lavando → pronto → aguardando → pago): carro pago às 08:00 empurrava o que pede ação. *Feito pelo Codex.*
- **"A cobrar" no lugar de "A receber"**: só conta carros prontos e não pagos (o dinheiro em risco); "A receber" somava carros nem lavados. *Codex.*
- **Estoque com dias restantes em destaque** (número grande), % em segundo plano. *Codex.*
- **Desfazer** (toast de 7 s) para ação, inclusive a baixa de estoque: toque errado com mão molhada era irreversível. *Claude.*
- **Folha de baixo com Radix Dialog**: focus trap, Esc, trava de rolagem, ARIA, mais arrastar para fechar. +13,7 KB gzip.
- **Acessibilidade:** axe-core (WCAG 2.2 AA) em todas as telas e painéis, celular e desktop, sem violações. Teste em `e2e/a11y.spec.ts` (janela alta de propósito: o axe só mede o visível e o painel rolável gerava falso positivo).
- **Marca:** 4 conceitos gerados pelo Codex (ImageGen) em `app/design/logo-concepts/`; escolhido o **selo** (nº 4: escudo + gota + "DH"), legível em 48 px. `app/scripts/make-icons.mjs` gera favicon, ícones PWA e maskable.
- **Efeitos com função:** valor que rola ao mudar (confirma a cobrança), borda animada só no carro em lavagem, ondas no cabeçalho. Tudo respeita "reduzir movimento".

### Bibliotecas avaliadas
- **shadcn/ui:** testado e **revertido**. O `init` sobrescreve a identidade (fonte Geist; variáveis `card`/`muted` colidem com os nossos tokens). Ficamos só com a base dele, o Radix Dialog.
- **Aceternity UI:** descartada. Licença comercial própria, guia oficial só para Next.js, sem suporte confirmado a Vite.
- **Magic UI:** MIT (não confirmado no site oficial), mas o que interessava (número que rola, borda animada) saiu em ~40 linhas sem depender de `motion`. Adotamos o padrão, não o pacote.
- **lucide-react:** já em uso.
- Pesquisa feita pelo Haiku (somente leitura); implementações de escopo fechado, pelo Codex (Sol medium); portões rodados pelo Claude.

## Rodada de conversão (2026-10-17, skill revenue-centric-design)
Plano em `PLANO-CONVERSAO.md`. Decisões do usuário: **a indústria (Marcos) paga ou patrocina e o lava jato usa de graça** (hipótese principal, ainda a confirmar com o Marcos); **a dor do título é "produto que acaba"** (refinar depois das conversas com donos de lava jato); **WhatsApp público dos botões: (81) 99947-6189** (`app/src/landing/contact.ts`).
- **Etapa 1, landing:** título "Seu lava jato fica sem produto no meio do dia? O DH Gestão avisa antes de acabar."; CTAs "Ver com carros de exemplo" + "Falar no WhatsApp" com microtexto (1 minuto, sem cadastro, sem custo); calculadora ganhou "E se o produto faltar?" (lavagens × valor da lavagem × dias parados, fórmula visível, números do usuário) e o botão "Levar essa conta para o WhatsApp" com a mensagem pronta.
- **Etapa 2, primeiros passos:** na demo, cartão "Quer ver com os dados do seu lava jato?" → escolha da dor (produto, cobrança ou fila) → modo **dados próprios** (`personal` no store: sem exemplos, sem recomeço diário) → cadastro de produto (`ProductSheet`) → primeiro carro → finalizar → cartão de "Deu certo" com o estoque real que baixou e botão "Contar como foi no WhatsApp". Progresso começa em 25% (`domain/onboarding.ts`). Restaurar volta aos exemplos.
- **Etapa 3, retenção sem backend:** placa já conhecida preenche modelo, cor e WhatsApp e mostra "Cliente conhecido" (`domain/history.ts`); "Meu mês" baixa planilha CSV das lavagens (dados são do dono, ficam só no aparelho).
- **Não feito de propósito:** medição de visitas (serviço externo, sem autorização), preço público, indicação e backend (esperam validação), roteiro de entrevista (fora do escopo).
- **Testes:** `npm run check` com 38 unitários e 49 de tela (celular e desktop), incluindo axe nos primeiros passos.

## Referência visual (Google Stitch)
Em `stitch_dh_gest_o_car_wash/`: 4 telas (`hoje_lavagens_do_dia`, `novo_agendamento`, `estoque_de_produtos`, `pedir_reposi_o_de_estoque`, cada uma com `screen.png` e `code.html`) e `hydro_fleet_operations/DESIGN.md` (tokens: teal `#006D77`, aqua `#2EC4B6`, coral `#FF6B35`; Plus Jakarta Sans + JetBrains Mono; alvos de toque 48–56 px; chips de status Aguardando/Lavando/Pronto/Pago).
É **referência**, não identidade final: nome interno "Hydro Fleet Operations", logo minúsculo e fotos geradas são provisórios. Problemas vistos: nomes de produto truncados, resíduo de texto "_RK" no Estoque, números que não fecham entre cards e resumo, título "Novo Item Estoque" na tela de reposição, fornecedores e foto inventados, data fixa 24/10 e card "Clima favorável" que não pedimos.

## Aprendizados medidos (detalhes em `notas-codex.md`)
- Codex: Sol/medium ~3 pontos de cota por feature média; Astra/high ~15 pontos para o mesmo resultado.
- O sandbox do Codex no Windows não roda build nem Playwright: o principal roda os testes.

## Acessos verificados (2026-10-17)
| Serviço | Claude (shell/MCP) | Codex (sessão do app desktop) |
|---|---|---|
| GitHub | `gh` logado como `tenorio94-prog` (escopos repo, workflow, gist, read:org) | Conector autenticado (mesma conta). O `gh` dentro do sandbox dele dá 401: é limite do sandbox, não da conta |
| Cloudflare | `wrangler` logado, conta do usuário (e há MCP Cloudflare na sessão do Claude) | **Não encontrado** (sem conector nem wrangler) |
| Supabase | Sem CLI instalado | Conector autenticado: projeto "Projeto aprender" . Não usar nesta demo |
| Netlify / Vercel | — | Conectores autenticados (alternativas de hospedagem, não usadas) |
| Geração de imagem | — | ImageGen disponível (ainda não testado); também Figma, Canva, Build Web Apps |
Observação: não confirmado que o Codex CLI chamado pelo plugin compartilha as conexões do app desktop. **Deploy e GitHub ficam com o Claude**; o Codex não precisa de acesso externo para implementar.

## Concluído
- Prompt do Stitch rodado; telas salvas em `stitch_dh_gest_o_car_wash/` (avaliação em `AVALIACAO.md`).
- Nome: não verificar disponibilidade (é só projeto, sem comercialização).

## Pendências
- Etapas 1 a 3 do `PLANO-CONVERSAO.md` implementadas (ver "Rodada de conversão"). Falta: confirmar o modelo com o Marcos, 20 conversas com donos de lava jato, decidir a medição de visitas (Cloudflare Web Analytics, grátis) e o roteiro de entrevista.
- Opcional: testar ImageGen do Codex para ilustrações de estado vazio.
- Fora de escopo por decisão do usuário: roteiro de entrevista, roteiro de apresentação ao Marcos, orçamento de cota, comparação Sonnet x Opus.
- Ideias para depois, só se a demo gerar interesse: mais de um produto por serviço com custo, fechamento de caixa, histórico por cliente.
