# DH Gestão — contexto e decisões

Estado em 2026-10-17. Fase atual: **0 (planejamento)**. Nada do produto foi construído ainda.

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

## Pendências (planejamento)
- `PLANO.md` da Fase 0: posicionamento, identidade/logo, lista de telas, dados fictícios coerentes, correções do Stitch.
- Arquitetura e estrutura de pastas; testes; repositório GitHub (privado, só com autorização); deploy Cloudflare (só com autorização).
- Orçamento de cota por fase e divisão Sonnet/Codex/Opus; desenho do teste Sonnet-vs-Opus.
- Teste pequeno de geração de imagem pelo Codex (ImageGen) para logo/ilustrações.
- Roteiro de entrevista para a descoberta com donos de lava jato; roteiro de apresentação ao Marcos.
- Decidir se o consultor Opus vira subagente (`.claude/agents/`).
