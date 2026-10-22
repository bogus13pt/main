# Basketball · INATEL · Época 2026/27

Livro de jogadas animadas. Site estático, pronto para GitHub Pages. Mesmo motor, estilo e regras do livro de jogadas do C.D.P.

## Estrutura

```
index.html             Homepage (INATEL, época, lista de jogadas)
jogada-revolver.html   Jogada "Revólver"
jogada-escadas.html    Jogada "Escadas"
assets/estilo.css      Estilo partilhado
assets/motor.js        Motor de animação partilhado
assets/bola.svg        Ícone (substitui o emblema; trocar por logotipo próprio se houver autorização)
robots.txt             Bloqueia indexação
.nojekyll              Evita processamento Jekyll no GitHub Pages
```

## Publicar no GitHub Pages

1. Criar repositório e enviar todos os ficheiros para a raiz.
2. Settings > Pages > Source: branch `main`, pasta `/ (root)`.
3. O site fica em `https://<utilizador>.github.io/<repositório>/`.

Num repositório público, as jogadas ficam visíveis para qualquer pessoa. O `noindex` só afasta os motores de pesquisa.

## Formato de uma jogada

Cada página é uma cópia de uma jogada existente com o bloco `window.JOGADA` alterado.

- `titulo`, `intro`: título e descrição curta.
- `inicio.pos`: posição inicial `{n:[x,y]}`; `inicio.bola`: quem tem a bola; `inicio.c`: legenda inicial.
- `fases`: lista ordenada, cada uma com `h`, `c` e `a` (acções).
- `alternativas`: finalizações à escolha, com `rotulo` (botão, identifica quem lança), `h`, `c`, `a`. Uma alternativa pode ter vários passos: `passos:[{h,c,a},…]`.
- `perguntaAlternativas`: texto acima dos botões.
- `resumo`: lista de texto no fim da página.

### Acções (`a`)

- Deslocação: `{m:4, to:[x,y], t:[início,fim]}`; curva: `c:[x,y]`; drible: `d:1`; bloqueio: `s:1`.
- Passe: `{p:1, t:[...]}`. Lançamento: `{p:'B', t:[...]}`, com `c:[x,y]` para dar arco.
- O mesmo jogador só se desloca uma vez por fase; para dois movimentos seguidos, usar duas fases.

### Coordenadas (viewBox 400 × 345)

Linha de fundo em cima (y = 20), cesto em (198, 67), laterais em x = 34 e x = 362, garrafão x 158–237 até y = 158, linha de 3 com cantos em x = 55 e 340.

### Notação

Contínua = deslocação · ondulada = drible · tracejada = passe · T = bloqueio.

## Acrescentar uma jogada

1. Copiar uma jogada para `jogada-<nome>.html` e substituir o bloco `JOGADA`.
2. Em `index.html`, acrescentar `<li><a class="jogada" href="jogada-<nome>.html"><strong>…</strong><span>…</span></a></li>`.
