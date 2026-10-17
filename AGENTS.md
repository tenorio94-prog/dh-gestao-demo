# DH Gestão — orientações para agentes

Demo de produto para donos de lava jato, mostrada por link no celular. **É um projeto, não uma empresa**: a identidade visual, o posicionamento e o nome nascem do zero. Não use logo, cores ou nome da DH Limp sem autorização explícita do usuário. A demo ilustra uma ideia; **não é um produto validado**. A descoberta com donos de lava jato ainda vai acontecer e define o que entra de verdade.

## Ao começar

1. Leia `context.md` (estado e decisões; ainda a criar na Fase 0) e `notas-codex.md` (o que medimos sobre o Codex). `context.md` não autoriza sozinho a próxima etapa.
2. Respeite instruções mais recentes do usuário. Não retome o que foi adiado.
3. O Doce Agenda (`C:\Users\Restore\Documents\doce-agenda`) é só referência de padrões (mobile-first, modo demonstração local, testes). **Não copie código nem a stack dele**: o usuário quer recomeçar com tecnologias diferentes. Não altere aquele projeto.

## Como trabalhar com o usuário

- Português brasileiro, claro e curto. O usuário é representante comercial, não desenvolvedor: explique o resultado e a próxima ação concreta, sem jargão.
- Poupe a cota: leitura direcionada, mudanças pequenas, verificação proporcional. O gargalo é o limite do Claude, não dinheiro.
- Decisões de rotina: decida e avise. Pergunte só por informação indispensável, ação sensível ou escolha que mude o produto.
- **Etapas:** o plano (`PLANO.md`) precisa ser aprovado antes de construir. Aprovado, execute as fases em sequência **sem parar entre elas**, com relato curto ao fim de cada uma. O usuário pediu o máximo de autonomia. Pré-autorizado no plano: repositório GitHub privado `dh-gestao-demo`, commits/push em `main`, deploy na Cloudflare em `workers.dev` com `noindex`. Pare e pergunte só para o que a lista abaixo e a seção "Autonomia" do plano exigem.
- Peça autorização antes de: publicar/deploy, qualquer serviço pago, DNS/domínio, apagar dados, usar marca de terceiros, mexer fora desta pasta.
- Registre resultados reais em `context.md`: diferencie implementado, testado e publicado. Não declare resolvido por uma tentativa; confira saída e status.

## Quem faz o quê (modelos)

| Camada | Modelo | Faz |
|---|---|---|
| Principal | Sonnet 5.5 | Rotina, implementação, commits, leitura de código, orquestração |
| Consultor | Opus 5.5 | Só nestes casos: planejamento/arquitetura, decisão de produto ambígua, bug que o principal não resolveu em 2 tentativas, revisão final de risco alto (dados, segurança, dinheiro), texto longo e importante (marca, copy) |
| Execução pesada | Codex (GPT) via plugin `codex` | Tarefa de escopo fechado com critério de aceite objetivo |
| Triagem | Haiku | Explorar código, ler documentação, resumir logs (somente leitura) |

Decisão do usuário: o Sonnet é o principal e **não haverá teste comparativo com o Opus**. O Opus está liberado como subagente, mas só se o principal travar; não precisa ser chamado por rotina. Orçamento de cota por fase: sem teto formal.

## Regras para delegar ao Codex (medido em `notas-codex.md`)

- **Modelo padrão: `gpt-6.1-sol` esforço `medium`** (~3 pontos de cota por feature média). `gpt-6-luna` low/medium para o trivial. **`gpt-6-astra` high custou ~5x o Sol com a mesma qualidade**: só se o Sol falhar ou em risco alto (RLS, bug difícil). Não use max/ultra sem motivo.
- Pacote da tarefa: objetivo, arquivos permitidos, regras que não mudam, critério de aceite com comandos, formato curto da resposta, "não faça commit", "não edite context.md nem docs".
- **O sandbox do Codex no Windows não roda build (esbuild) nem Playwright.** Ele relata o bloqueio honestamente. Quem roda os portões (testes, build, teste de tela) é o principal, fora do sandbox, e só olha a saída resumida.
- Experimentos e tarefas arriscadas rodam em **cópia descartável** (scratchpad), nunca direto na pasta de trabalho, até o resultado ser conferido.
- Sempre revise o diff antes de aceitar: o Codex edita arquivos que você não pediu quando acha que ajuda.
- Imagens: o Codex pode gerar (a confirmar com um teste pequeno) e gasta o mesmo saldo do código. Só sob pedido do usuário.
- A cota do Codex acaba: quando a janela de 5 h fechar, volte ao principal e avise o usuário. Para medir consumo, peça ao usuário a leitura do `/status` do Codex antes e depois.

## Produto e escopo da demo

- Duas partes: **agenda de lavagens** (placa, serviço, horário, status) e **consumo e reposição de produto** (cada serviço gasta produto, o estoque cai, alerta de reposição com pedido ao fornecedor).
- Mobile primeiro (360 px, sem rolagem horizontal), estados de vazio e erro claros, dados fictícios realistas, sem cadastro nem backend nesta fase.
- Stack do frontend (decidida): **Vite + React + TypeScript + Tailwind CSS**, site estático na Cloudflare, dados locais no navegador. Motivo e histórico em `context.md`.
- Nunca use dados reais de clientes. Sem credenciais, tokens ou `.env` no repositório.

## Publicação

- Hospedagem prevista: Cloudflare, na conta do usuário. Publicar é ação externa: só com autorização e com o usuário autenticando (login interativo é com ele). Informe o endereço realmente verificado, não só o build local.
- Commit e push não equivalem a deploy.
