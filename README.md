# Elyra Odontologia — site institucional (case de portfólio)

Clínica odontológica **fictícia**. Site estático (HTML/CSS/JS, sem build) criado como case da AJ Solutions Tech.

## Rodar localmente

```bash
python -m http.server 4630 --directory elyra-odontologia
```

Abra http://localhost:4630.

## Estrutura

- `index.html`: página única e semântica, com SEO, Open Graph e JSON-LD (`Dentist`).
- `assets/css/styles.css`: sistema visual "Ficha de Planejamento do Sorriso" (tokens no `:root`).
- `assets/js/main.js`: header, menu mobile, reveals, contadores, parallax, preview dos tratamentos, comparador atual/planejado (camada de planejamento em SVG sobre a mesma foto), depoimentos, etapas do processo e formulário (simulado).
- `assets/js/arch.js`: arcada 3D procedural em nuvem de pontos (canvas 2D), com 4 modos: escaneamento, planejamento, radiografia e impressão 3D.
- `assets/img/`: fotos em WebP. Cada uma tem um sidecar `.json` com a origem.

## Imagens

- Os originais ficam em `.impeccable/img-src/`. Para (re)gerar as versões servidas, rode:

  ```
  python .impeccable/build-images.py
  ```

  O script gera `nome.webp` (maior tamanho necessário), `nome-<largura>.webp` (versões menores para o `srcset`) e, para os tratamentos, `nome-thumb.webp` (recorte 4:5 da lista no celular). Tudo em WebP q72.
- Para trocar uma foto, substitua o original em `img-src/` (mesmo nome) e rode o script. As tags `<img>` já apontam para as variantes; o JS monta o `srcset` das imagens trocadas em tempo de execução (prévia dos tratamentos e casos de Resultados) com o mesmo padrão de nomes.
- `vercel.json` define o cache das imagens (30 dias) e de CSS/JS (1 dia). `.vercelignore` deixa `.impeccable/` e os .md fora do deploy.

## Dados placeholder (substituir num projeto real)

- Telefone (00) 0000-0000, WhatsApp (00) 99999-9999 e link `wa.me/5500999999999`.
- CRO 00000, endereço Av. República, 1250 (sem cidade) e mapa ilustrativo em SVG.
- Nota 4,9 / 280 avaliações, +3.800 pacientes, +12 anos, 8 especialistas e depoimentos: tudo fictício.
- Resultados (Atual / Planejado): a mesma foto, sem retoque, com o planejamento desenhado em SVG por cima (`.plan__case` em index.html). As coordenadas são ajustadas a cada foto; ao trocar a imagem de um caso, redesenhe a camada. `ba-3.webp` é um recorte paisagem (y 440–1460) do original 1400×2100. Imagens ilustrativas, com aviso dentro do quadro.
- Formulário: o envio é simulado no front-end, sem backend.
- `robots: noindex`: retirar ao publicar como site real.
- Domínio fictício `elyraodontologia.com.br` em `canonical`, `og:url` e `og:image` (absoluta): trocar pelo domínio real no deploy, senão a prévia de compartilhamento não carrega a imagem.
- Crédito "Desenvolvido por AJ Solutions Tech" está sem link (não há URL da agência); adicionar quando existir.
- Promessas do CTA ("O que acontece depois": retorno no período escolhido, avaliação no melhor horário, planejamento e orçamento por escrito sem compromisso): confirmar com a clínica antes de publicar.

## Créditos das fotos (Unsplash License)

| Arquivo | Foto | Autor |
|---|---|---|
| hero.webp | https://unsplash.com/photos/Ll9YOG20UFI | Nolan Manning |
| clinic-reception.webp | https://unsplash.com/photos/tUcVQwXsNck | Aalo Lens |
| clinic-corridor.webp | https://unsplash.com/photos/1PXsFfTbEcI | Aalo Lens |
| clinic-room.webp | https://unsplash.com/photos/Fdku_oMrDvk | Kari Bjorn Photography |
| clinic-lounge.webp | https://unsplash.com/photos/81bAlhg7rQQ | Takafumi Yamashita |
| clinic-chair.webp | https://unsplash.com/photos/44jaETSVX2I | Katarzyna Zygnerska |
| clinic-detail.webp | https://unsplash.com/photos/0rrpIWXp7uk | Eline Marrieth |
| clinic-light.webp | https://unsplash.com/photos/DWfPqYf5ARU | Alexander Kaufmann |
| team-helena.webp | https://unsplash.com/photos/r2o9MXiFq78 | GN Group |
| team-rafael.webp | https://unsplash.com/photos/no7wWT_g9OA | SoyBreno |
| team-camila.webp | https://unsplash.com/photos/1l6UeCc9P9o | Joecalih |
| tech-scanner.webp | https://unsplash.com/photos/JaL1PZq-gHE | Mélyna Côté |
| consult.webp | https://unsplash.com/photos/uqveD8dYPUM | Caroline LM |
| tr-implantes.webp | https://unsplash.com/photos/eHwRLpfHSKY | Katarzyna Zygnerska |
| tr-lentes.webp | https://unsplash.com/photos/rQVrZdAHXQQ | Ozkan Guner |
| tr-alinhadores.webp | https://unsplash.com/photos/irPpXQF5bSI | Geniova Technologies |
| tr-clareamento.webp | https://unsplash.com/photos/yIitNO2Bgdo | Alexander Krivitskiy |
| tr-reabilitacao.webp | https://unsplash.com/photos/kL6LP2olEds | Ozkan Guner |
| tr-preventiva.webp | https://unsplash.com/photos/fNSPSQAH1mQ | Nate Johnston |
| ba-1.webp | https://unsplash.com/photos/X7smMpe1CDE | Ozkan Guner |
| ba-2.webp | https://unsplash.com/photos/7Mut2WMWttA | Ozkan Guner |
| ba-3.webp | https://unsplash.com/photos/glPVwPr1FKo | Tony Litvyak |
