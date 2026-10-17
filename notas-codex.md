# Notas: aprendendo com o Codex

Registro do que descobrimos. Cada entrada diz se é **fato verificado** ou **opinião/estimativa**.

## Setup (2026-10-17) — fato
- Codex CLI 0.163.0, login ChatGPT ativo (plano Plus), plugin `codex@openai-codex` 1.0.6 em escopo user.
- Modelo padrão em `~/.codex/config.toml`: `gpt-6.1-sol`, esforço `medium`.
- Origem: `~/.codex/models_cache.json`.

## Modelos disponíveis na conta — fato (cache local)
| Modelo | Descrição oficial | Contexto | Esforços | Padrão |
|---|---|---|---|---|
| gpt-6.1-sol | workhorse mais recente, código e dia a dia | 500k | low…ultra | low |
| gpt-6-astra | inteligência de fronteira, trabalho mais exigente | 272k | low…ultra | low |
| gpt-6-sol | workhorse da geração anterior | 272k | low…ultra | medium |
| gpt-6-luna | rápido e barato, tarefas fáceis | 272k | low…max | medium |
| gpt-5.6-sol / terra / luna | gerações antigas | 272k | — | — |

Esforços: low, medium, high, xhigh, max, ultra. Ocultos: gpt-reserve, codex-auto-review.

## Rodada 1 — opinião do Codex sobre qual modelo usar (opinião, não medido)
Prompt: `scratchpad/q1.md`. Resposta bruta: `scratchpad/a1.md`.

| Trabalho | Modelo / esforço sugerido |
|---|---|
| CSS/HTML pequeno | luna / low |
| Feature média em JS | 6.1-sol / medium |
| Refatoração mecânica | luna / medium |
| Cálculo financeiro (centavos) | 6.1-sol / high |
| Bug difícil | astra / high (xhigh só se inconclusivo) |
| Revisão adversarial | 6.1-sol / high |
| Testes Playwright | luna / medium |
| Microcopy pt-BR | luna / low |
| Migração Supabase/RLS | astra / high |
| Resumir logs/docs | luna / medium |

### O que o Codex disse sobre si mesmo
- **Não sabe** a ordem de consumo de cota entre modelos nem o efeito do esforço nos limites 5h/semanal. Ordem luna < sol < astra é só inferência das descrições.
- Max/ultra: sem evidência de que compensem; só em experimentos pontuais.
- Não delegar: tarefa vaga, decisão financeira ou de autorização sem regras explícitas, mudança enorme sem fronteira, duas implementações concorrentes.
- Prompt ideal: objetivo, escopo, contexto, evidências, critério de aceite, formato de entrega; separar fato de hipótese; parar quando o aceite for satisfeito.

## Pendências / como validar
- Consumo real por modelo: medir com `/status` no Codex antes e depois de tarefas equivalentes.
- Comparar luna vs sol em 1 tarefa real do doce-agenda (qualidade, tempo, cota).
- Conferir se Plus de fato roda 6.1-sol e astra sem erro de acesso (fontes web divergiam).

## Experimento 1 — averageTicketCents em monthly-summary (cópia descartável, nada tocou o doce-agenda)
Tarefa: `scratchpad/exp1-task.md`. Baseline: 9 testes passando. Cota antes: 76% restante (janela 5h).

| | gpt-6-luna / medium | gpt-6.1-sol / medium |
|---|---|---|
| Tempo | 45 s | 63 s |
| Testes ao final | 10 ok | 12 ok |
| Código | 1 linha, correta | 1 variável + 1 linha, correta, mais legível |
| Testes escritos | 1 teste juntando os 3 cenários | 3 testes, um por cenário pedido (seguiu o pedido à risca) |
| Cota depois | 76% (sem queda visível) | 75% (queda de ~1 ponto) |

Leitura (opinião minha, n=1): ambos corretos e mínimos. Sol seguiu a especificação com mais fidelidade (3 testes separados); Luna foi 28% mais rápido e entregou o essencial. Para tarefa pequena e bem especificada, a diferença de qualidade é pequena.
Cota: o painel não mostrou queda após o Luna (custo <1% ou painel atrasado).
Cota (leitura do usuário): 76% → 76% após Luna → 75% após Sol. O painel só mostra inteiros, então o Luna custou <1 ponto e o Sol ~1 ponto (pode ser 0,5 a 1,5). Cada tarefa pequena custa cerca de 1% da janela de 5h, ou seja, ~100 tarefas assim por janela no pior caso, e o teto semanal pode limitar antes. Precisão baixa: n=1 por modelo.

## Experimento 2 — ticket médio na tela "Meu mês" (cloud + public + 2 testes; cópia descartável)
Tarefa: `scratchpad/exp2-task.md`. Cota antes: 75%.

**gpt-6.1-sol / medium** — 178 s.
- Alterou os 5 arquivos pedidos (+ `public/browser-store.js`, que a demo duplica, e acertou em sincronizar) e **também `context.md`** (não pedi; o AGENTS.md da cópia manda atualizar).
- Dentro do sandbox do Codex **build e teste de tela falharam** (esbuild: acesso negado; Chromium ausente). Ele relatou isso com honestidade: "63 passaram, 2 falharam pelo esbuild", sem declarar sucesso.
- Verificado por mim fora do sandbox: `npm test` 67/67, `npm run build` ok, `test-monthly-summary.mjs` passou (todos os casos, 360 e 1440 px). Ou seja, o código estava certo.
- **Lição:** o Codex no Windows não consegue rodar build/Playwright. A verificação (portões automáticos) deve ser rodada pelo orquestrador ou por script, não esperada do Codex. Isso é barato para o Claude (só saída resumida).

**Cota no exp2:** Sol/medium custou **3 pontos** (75% → 72%) em 178 s.

**gpt-6-astra / high** — 219 s. Mesmo resultado funcional: mesmos 6 arquivos, mesma linha de cálculo e mesmo HTML do bloco (idênticos ao Sol), 3 linhas a mais de testes; também mexeu no `context.md` e também foi bloqueado pelo sandbox (esbuild/Chromium). Verificado por mim fora do sandbox: `npm test` 67/67, build ok, teste de tela passou.
Cota depois: **57%** (72% → 57% = 15 pontos).

Comparação Sol/medium vs Astra/high nesta tarefa: qualidade igual (diffs praticamente idênticos), Astra 23% mais lento. Se o custo de cota do Astra for maior, ele não se justifica aqui.

### Custo medido (janela de 5h, leitura do painel do usuário)
| Tarefa | Modelo / esforço | Pontos de cota | Qualidade |
|---|---|---|---|
| exp1 pequena (1 função + testes) | luna / medium | <1 | correta |
| exp1 pequena | 6.1-sol / medium | ~1 | correta |
| exp2 média (cálculo + tela + testes) | 6.1-sol / medium | **3** | correta, passou nos portões |
| exp2 média | astra / high | **15** | idêntica à do Sol |

Conclusão (n=1 por célula, mas a diferença é grande): Astra/high custou ~5x o Sol/medium sem ganho de qualidade nesta tarefa. Padrão recomendado: Luna/low-medium para trivial, Sol/medium para o normal; Astra/high só quando Sol falhar ou para diagnóstico/RLS de alto risco. Max/ultra: não usar sem motivo.
Orçamento: ~3 pontos por feature média no Sol → ~20 features por janela de 5h no melhor caso; o teto semanal ainda não foi medido.
