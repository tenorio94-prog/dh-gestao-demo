# Avaliação das telas do Stitch (2026-10-17)

Telas avaliadas: Hoje, Novo agendamento, Estoque, Pedir reposição, mais `hydro_fleet_operations/DESIGN.md`. É referência visual, não identidade final.

## O que está bom
- **Direção visual:** teal, aqua e coral combinam com água e brilho, sem parecer genérico. Botões grandes; placas Mercosul dão identidade imediata.
- **Hierarquia:** na tela Hoje, o resumo do dia, os chips de status e os botões de ação por carro ("Lavando", "Cobrar", "Avisar") fazem sentido para quem trabalha em pé.
- **Estoque:** a melhor ideia do conjunto. "Usa 120 ml por lavagem, restam ~12 lavagens, acaba em 4 dias" mostra o valor que se quer vender à indústria.
- **`DESIGN.md`:** tokens de cor, tipografia (Plus Jakarta Sans e JetBrains Mono), raios e tamanhos de toque. Dá para virar o tema do Tailwind quase direto.

## O que está errado ou precisa de decisão
- Nomes de produto truncados ("Shampoo Aut...", "Pretinho para...").
- Resíduo de texto "_RK" sobre o card da cera, no Estoque.
- Números que não fecham: "Faturado R$ 90" não bate com os carros pagos; "Pátio cheio" com 8 carros é suposição.
- A tela de reposição se chama "Novo Item Estoque", mas é um pedido. Título errado.
- Fornecedores e foto de produto inventados. Na demo vale como ilustração, mas não podem parecer reais para o Marcos.
- Card "Clima favorável" e data fixa (24/10) não foram pedidos. Tirar o clima.
- Logo minúsculo e provisório; o nome interno "Hydro Fleet Operations" não vai para o produto.
- Coral claro com texto branco pode ter contraste baixo no sol. Testar.

## Onde isso deixa o projeto
A base visual existe, então a Fase 0 fica mais curta. Falta: posicionamento (para quem, por que, promessa em uma frase), logo e nome visual, e as telas que o Stitch não fez ("Meu mês", fluxo de entrada).
