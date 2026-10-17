# DH Gestão — Plano da Fase 0

Demo de gestão para lava jato, por link no celular. Ilustra uma ideia; **não é produto validado**. Este plano cobre posicionamento e identidade, telas e dados, arquitetura, testes, repositório e publicação. Aprovar este plano autoriza também o que está em "Autorizações".

## 1. Posicionamento e identidade

**Para quem:** dono de lava jato pequeno ou médio (1 a 10 funcionários) que toca o pátio pelo celular, em pé, com a mão molhada.
**Promessa (uma frase):** *"Seu pátio e seu estoque na palma da mão: quem está na fila, quanto entrou e quando o produto vai acabar."*
**Três provas:** (1) cadastrar um carro em menos de 30 s; (2) fechar o dia sabendo quanto foi cobrado e quanto falta receber; (3) saber **dias restantes** de cada produto e pedir reposição em um toque, por WhatsApp.
**Tom:** direto, prático, de pátio. Frases curtas, sem jargão de software.
**O que não é:** nota fiscal, ponto eletrônico, loja online. Fora do escopo.

**Identidade visual** (base: `stitch_dh_gest_o_car_wash/hydro_fleet_operations/DESIGN.md`, adaptada):
- Cores: teal `#006D77` (marca), aqua `#2EC4B6` (apoio, progresso), coral `#FF6B35` **só como destaque** (ícones, chips, brilho).
- **Correção de contraste:** texto branco sobre coral `#FF6B35` dá cerca de 2,8:1 (reprova). Botão principal usa o coral escuro `#B23700` (cerca de 6:1 com branco).
- Tipografia: Plus Jakarta Sans (texto) e JetBrains Mono (placas), hospedadas no próprio site (`@fontsource`), sem Google Fonts em tempo de execução.
- Logo: monograma "DH" + gota, desenhado em SVG por mim; wordmark "DH Gestão". Ilustrações de estado vazio e ícone do app: teste de ImageGen do Codex com 1 imagem primeiro; se ficar bom, segue; se não, SVG próprio.
- Sem logo, cor ou nome da DH Limp.

## 2. Telas e dados

Navegação inferior com 3 abas: **Hoje · Estoque · Meu mês**.

| Tela | Conteúdo |
|---|---|
| Hoje | Resumo do dia (carros, previsto, recebido), filtros por status, cartões com placa Mercosul, modelo, serviço, horário, valor e botão de ação seguinte |
| Novo agendamento | Placa, modelo e cor, serviço (preço e duração), horário, valor ajustável, WhatsApp opcional. Em menos de 30 s |
| Cobrança | Forma de pagamento (Pix, cartão, dinheiro), marcar pago, recibo por WhatsApp |
| Estoque | Produtos com nível, **dias restantes**, consumo por lavagem, alerta de reposição |
| Ajuste do produto | Corrigir saldo, consumo por serviço (ml) |
| Pedir reposição | Quantidade, total estimado, mensagem pronta e botão que abre o WhatsApp com o texto. Sem fornecedores inventados: o número do fornecedor é um campo editável da demo |
| Meu mês | Vendido, recebido, serviços mais vendidos, produto consumido no mês |
| Aviso de demo | Faixa "Dados de exemplo" e botão "Restaurar exemplo" |

**Regras de negócio (decididas):**
- Dinheiro em **centavos inteiros**; fuso `America/Sao_Paulo`; datas do seed **relativas a hoje**, nunca fixas.
- Estados do carro: Aguardando → Lavando → Pronto → Pago.
- O estoque baixa quando o carro vai para **Pronto**, usando o consumo do serviço.
- Dias restantes = saldo ÷ média diária dos últimos 7 dias. **Crítico** ≤ 5 dias, **atenção** ≤ 10.
- Todos os totais (resumo do dia, mês) são **calculados** a partir dos agendamentos, nunca digitados. Corrige os números que não fechavam no Stitch.
- Tirar do Stitch: card de clima, fornecedores e foto inventados, título "Novo Item Estoque".

**Dados fictícios:** 6 serviços (simples, completa + cera, polimento, higienização interna, etc.), 4 a 5 produtos, cerca de 8 carros hoje em estados variados e 30 dias de histórico para consumo e "Meu mês".

## 3. Arquitetura

- **Stack (decidida):** Vite + React + TypeScript + Tailwind CSS. Versões fixadas. Estático.
- **Estado:** Zustand com persistência em `localStorage` (chave com versão, para migrar o formato depois). Regras de negócio como funções puras em `src/domain/`, sem React, para testar fácil.
- **Rotas:** React Router em modo hash (funciona em hospedagem estática sem configuração).
- **Ícones:** lucide-react. **Fontes:** `@fontsource`, no próprio site.
- **App instalável:** manifest e ícones para "Adicionar à tela inicial". Sem service worker nesta fase (evita cache preso).
- **Sem backend, sem login, sem dados reais.**
- **Pastas:**
  ```
  /                  AGENTS.md, CLAUDE.md, context.md, PLANO.md, notas-codex.md
  stitch_dh_gest_o_car_wash/   referência visual (mantida)
  app/               projeto Vite
    src/domain/      regras puras + testes
    src/data/        seed relativo a hoje
    src/store/       Zustand
    src/ui/          componentes (PlateBadge, StatusChip, StockCard...)
    src/screens/     Hoje, Estoque, Mês, sheets
    e2e/             testes Playwright
  ```

## 4. Testes

- **Vitest** nas regras de `domain/`: centavos, totais, dias restantes, baixa de estoque, alertas, seed coerente.
- **Playwright** em 360 e 1280 px: fluxo novo agendamento → Lavando → Pronto → Pago; estoque baixa e alerta aparece; sem rolagem horizontal; sem erros no console; capturas que eu olho.
- Portão único: `npm run check` = typecheck + lint + Vitest + build + Playwright. **Eu rodo** (o sandbox do Codex não roda build nem Playwright).
- Cada fase só termina com o portão verde. Falha repetida: diagnosticar antes de repetir.

## 5. Repositório e publicação

- **GitHub:** repositório **privado** `dh-gestao-demo` na sua conta (`tenorio94-prog`), push direto em `main`, um commit por assunto. Antes do primeiro commit: `.gitignore` (node_modules, dist, .wrangler, .env) e retirar e-mails pessoais do `context.md`.
- **Cloudflare:** Workers Static Assets via `wrangler`, endereço `*.workers.dev`. `noindex` + `robots.txt`: o link só circula por quem recebe. Verificar o endereço **publicado** em 360 px, não só o build.

## 6. Fases e execução

| Fase | Entrega |
|---|---|
| F1 Fundação | Scaffold, tokens, layout e abas, seed, store, regras com testes, repositório GitHub, teste de ImageGen |
| F2 Agenda | Hoje, Novo agendamento, Cobrança |
| F3 Estoque | Estoque, ajuste, Pedir reposição por WhatsApp |
| F4 Mês e acabamento | Meu mês, estados vazios, contraste, E2E completo |
| F5 Publicação | Deploy, verificação do link real, relatório e atualização do `context.md` |

**Quem faz:** eu (Sonnet) conduzo e implemento. O Codex (Sol medium, escopo fechado) pega regras de domínio com testes e escrita de E2E; eu reviso o diff. Opus como subagente fica disponível, mas só se eu travar. Orçamento de cota: sem teto formal.

## Autonomia

Aprovado este plano, executo F1 a F5 **sem parar entre fases**, com um relato curto ao fim de cada uma. **Pré-autorizado:** criar o repositório privado `dh-gestao-demo`, commits e push em `main`, publicar na Cloudflare em `workers.dev` com `noindex`. **Eu paro e pergunto** para: domínio próprio, serviço pago, uso da marca DH Limp, dados reais, apagar algo, mexer fora desta pasta, ou teste que falhe após 2 diagnósticos.

## Fora de escopo (por ora)
Roteiro de entrevista, roteiro de apresentação ao Marcos, backend/Supabase, login, nota fiscal, integração real com WhatsApp.
