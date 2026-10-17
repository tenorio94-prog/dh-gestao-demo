# DH Gestão — Plano de conversão (skill Revenue-Centric Design)

Data: 2026-10-17. Base: skill `revenue-centric-design` (134 princípios do designer Richard, @richardrx), instalada em `.claude/skills/revenue-centric-design/`. Os números dela vêm de SaaS (EUA e Brasil), não de lava jato: servem de **hipótese para testar**, não de promessa.

## 1. O diagnóstico em uma frase

A demo está bem construída (rápida, acessível, honesta), mas **ninguém ainda sabe se alguém quer isso**. Pela regra da skill: *"se ninguém entra no produto, é distribuição; se entra e não paga, é design"*. Hoje o gargalo é **distribuição e validação**, não tela. Então o plano gasta pouco com visual e muito em colocar a demo na mão de donos de lava jato e medir o que acontece.

## 2. Princípios da skill que mais valem aqui

| Princípio | O que muda para a DH Gestão |
|---|---|
| Quem fala com todo mundo não convence ninguém (ICP) | Definir **um** dono de lava jato (porte, cidade, como controla hoje) antes de mexer em cópia |
| Elogio não é validação: "falta o que pra você fazer o PIX agora?" | A demo serve para vender/pedir compromisso, não para colher "legal!" |
| Cobre dos 10 primeiros desde o dia 1 | Piloto pago (mesmo simbólico) mede dor real; grátis mede curiosidade |
| Valor primeiro, pedido depois | Calculadora já faz isso; falta o passo seguinte (levar o resultado no WhatsApp) |
| Sua promessa tem o tamanho da sua prova | Sem depoimento/número inventado. A prova vem do primeiro piloto, com dado real |
| Hero em 5 segundos: o que é, para quem, por que agora | Hero atual não diz "lava jato" nem a dor em dinheiro |
| CTA: o que acontece, quanto demora, quanto custa | "Abrir a demonstração" não responde nenhuma das três |
| Nunca entregar dashboard vazio; TTV curto; ativar, não cadastrar | Primeiro uso com os dados do próprio dono em poucos minutos |
| Custo de saída cria retenção (histórico, hábito) | Histórico por cliente e reposição recorrente são o "cofre" do produto |
| Disciplina de funcionalidades (Swiss Knife) | Segurar boleto, nota fiscal, login etc. na lista de espera até a dor ser provada |
| Preço é filtro; ancore no valor, não no concorrente mais barato | Descobrir o valor em reais que o dono perde hoje, depois precificar |

## 3. Decisões que são suas (mudam o produto)

1. **Quem paga?** Três modelos muito diferentes:
   - **A. O lava jato paga mensalidade.** Funil de SaaS clássico: precisa de aquisição própria, ativação e retenção.
   - **B. A indústria (Marcos) paga ou patrocina; o lava jato usa de graça.** O produto vira canal de venda de reposição. O gargalo de distribuição se resolve pela carteira de clientes da indústria, e o "cliente" da conversa passa a ser a indústria.
   - **C. Híbrido:** grátis para clientes da indústria, pago para os demais.
   A demo hoje serve aos dois públicos, mas a página de entrada fala só com o dono do lava jato. Minha recomendação: **tratar B como hipótese principal**, porque casa com o seu contexto (representante comercial, ligação com a indústria) e elimina o maior problema (conseguir clientes um a um). Precisa ser confirmado com o Marcos.
2. **Qual dor puxa a venda?** Hoje o título lista três coisas (fila, cobrança, produto acabando). A skill pede **uma** promessa. Candidatas: *dinheiro que escapa* (carro pronto que sai sem pagar) ou *produto que acaba no meio do dia*. Recomendo testar nas conversas qual faz o dono dizer "isso acontece comigo". Se for B, a segunda é a mais forte.
3. **Contato de conversão:** um número de WhatsApp para os botões (o seu, ou outro). Sem ele não há conversão para medir.

## 4. Plano em três ondas

### Onda 1: medir e preparar a conversa (pequeno, sem mudar o produto)
- **Medição mínima:** Cloudflare Web Analytics (grátis, sem cookie) para saber visita, abertura da demo e clique no WhatsApp. Também conferir o tempo de carregamento (a skill cita +8% de vendas com 31% menos de LCP). *Precisa da sua autorização (serviço externo).*
- **Hero reescrito** (teste dos 5 segundos): nomear o público e a dor em reais. Exemplo a validar: *"Seu lava jato perde dinheiro com carro que sai sem pagar e produto que acaba na hora errada. Veja quanto."*
- **CTA com microcopy** (o que acontece, tempo, custo): botão "Ver com carros de exemplo" e linha abaixo "1 minuto, sem cadastro, no celular". Segundo botão: "Falar no WhatsApp".
- **Calculadora com continuação:** depois do resultado, "Receber esse cálculo e uma conversa de 10 min no WhatsApp". Valor primeiro, pedido depois. Um campo só (telefone).
- **Conversão em reais na calculadora:** acrescentar "quanto você deixa de faturar por mês", com a fórmula visível e editável, sem número inventado.
- **Teste de 5 segundos com 5 donos de lava jato:** mostrar o topo da página por 5 s, esconder, perguntar "o que faz? para quem?".
- **Seção "Ainda é um experimento":** manter. É honesta e não inventa prova. Trocar a prova só quando houver piloto real (nota 4,2–4,5 de verdade é melhor que perfeita).

### Onda 2: ativação com dados reais (muda o app)
Meta: o dono ver valor **com os próprios dados em menos de 5 minutos**. Métrica de ativação (hipótese): *cadastrou 1 produto com estoque real e registrou 1 carro*.
- **Primeira abertura:** uma pergunta de intenção ("o que você quer resolver primeiro: cobrança, fila ou produto?") que ramifica o caminho. A skill chama de atrito declarativo: custa 30 s e aumenta o compromisso.
- **Trocar exemplos pelos seus dados:** faixa visível no app em modo demonstração, com lista curta "1. cadastre um produto, 2. registre um carro" e progresso começando em 20%, não 0%.
- **Comemorar o primeiro valor:** primeira cobrança confirmada ou primeiro alerta de reposição ganham um momento visual (já existe o número que rola; só falta marcar o "primeiro").
- **Estado vazio que aponta a próxima ação**, nunca tela em branco.
- **Lembrete de reposição por WhatsApp** como hábito recorrente: o dono volta porque o app avisa, não porque lembrou.
- **Dados reais exigem decisão:** hoje tudo fica no navegador. Para um piloto de verdade basta **exportar/guardar o histórico** (CSV ou cópia no aparelho); backend e login só depois de validar (continua fora de escopo).

### Onda 3: modelo de receita e retenção (depende da decisão 1)
- **Preço:** não publicar valor ainda. Calcular o **valor de referência** (cobranças perdidas + produto desperdiçado por mês) nas entrevistas e precificar uma fração disso. Evitar plano gratuito aberto se o modelo for A. Se for B, o "preço" é a mensalidade/comissão da indústria.
- **Plano em três níveis só se houver razão** (Bom–Melhor–Ótimo, com o do meio como alvo). Não montar tabela de preços sem dado de disposição a pagar.
- **Custo de saída saudável:** histórico por cliente (placa, serviços, última lavagem), relatório mensal, produtos e fornecedor já configurados. Quanto mais histórico, mais difícil largar.
- **Indicação:** um dono mostra a outro. Formato "o lava jato amigo ganha X" funciona melhor como brinde dentro do produto do que dinheiro. Só depois do produto ser querido.
- **Disciplina de funcionalidades:** manter a lista de espera (boleto, nota fiscal, integração real, login). Antes de cada item, perguntar: "quantos meses de validação isso adia?" e "qual funcionalidade sai para dar lugar?". Meta de uso: o que menos de 10% dos pilotos usarem sai ou se esconde.

## 5. O que eu tiraria ou mudaria no que já existe
- **Título atual** (três promessas) → uma promessa só, com o público nomeado.
- **"Abrir a demonstração" repetido** (cabeçalho, hero, rodapé) → CTAs diferentes por momento: ver, calcular, falar.
- **Ver se o quadro por etapa do desktop** serve ao dono que está no pátio com o celular. Se as conversas mostrarem que ninguém usa o desktop, é candidato a esconder.
- **Nada de nome/logo da DH Limp** (regra do projeto continua). Se o modelo B for adiante, isso volta a ser decisão sua com o Marcos.

## 6. Distribuição: a conta que importa
Sem canal, a melhor página converte zero. Passos concretos:
1. **20 conversas** com donos de lava jato (indicação de conhecidos e clientes da indústria; presencial com o celular na mão).
2. Em cada uma: mostrar a demo, pedir para ele mexer, perguntar *"falta o que pra você usar isso já na semana que vem?"* e *"quanto você perde hoje com isso?"*. Anotar a objeção literal; ela vira argumento de venda e item de perguntas frequentes.
3. **Um canal só por vez** (método Bullseye): WhatsApp direto. Mapa de resultados: conversas → demos abertas → pilotos → pagantes.
4. Roteiro de entrevista e de apresentação ao Marcos estavam fora de escopo por decisão sua. Posso incluir se quiser; é a peça que falta para este plano rodar.

## 7. Como saberemos se funcionou (hipóteses, não metas)
| Etapa | Métrica | Leitura |
|---|---|---|
| Entrada | visitas únicas, tempo de carregamento | página rápida e acessada |
| Interesse | % que abre a demo; % que usa a calculadora | topo e CTA funcionam |
| Conversa | % que clica no WhatsApp | prova de interesse mais forte que elogio |
| Ativação | pilotos que cadastram produto e carro reais em 5 min | valor percebido |
| Receita | pilotos que aceitam pagar / indicar | validação real |

## 8. Ordem sugerida
1. Sua decisão sobre quem paga e o WhatsApp de contato (itens 3.1 e 3.3).
2. Onda 1 inteira (pequena, publicável em um dia). Eu implemento e publico com a sua autorização.
3. Roteiro de entrevista e primeiras 5 conversas em paralelo.
4. Onda 2 só com o que as conversas pedirem. Onda 3 depois.
