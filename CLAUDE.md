@AGENTS.md

## Só para o Claude Code

- As regras de `AGENTS.md` valem integralmente; este arquivo só acrescenta o que é específico desta ferramenta.
- Codex: use `/codex:rescue` (ou o subagente `codex:codex-rescue`) para tarefas de escopo fechado. O plugin `codex@openai-codex` está instalado em escopo de usuário. `/codex:setup` confere login. `/codex:review` serve de segunda opinião sobre diffs.
- Para chamar o Codex com modelo e esforço definidos, passe `--model gpt-6.1-sol --effort medium` (ou o modelo indicado em `AGENTS.md`). `--background` para tarefas longas, `/codex:status` e `/codex:result` para acompanhar.
- Opus como consultor: criar um subagente somente leitura (`model: opus`) em `.claude/agents/` na Fase 0, se o usuário aprovar. Até lá, o usuário troca de modelo com `/model`.
- Documentação de bibliotecas: consulte a oficial antes de supor uma API; a versão instalada fica no `package.json` (quando existir).
- Memória pessoal do Claude não substitui `context.md`: decisões do projeto vão para lá.
