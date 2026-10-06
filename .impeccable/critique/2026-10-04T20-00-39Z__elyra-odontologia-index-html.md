---
target: elyra-odontologia/index.html
total_score: 23
max_score: 32
na_heuristics: 7,10
p0_count: 0
p1_count: 3
timestamp: 2026-10-04T20-00-39Z
slug: elyra-odontologia-index-html
---
Method: dual-agent (A: revisão de design · B: detector + navegador)

## Design Health Score

| # | Heurística | Nota | Problema principal |
|---|---|---|---|
| 1 | Visibilidade do status | 3 | Nav ativa, spinner, sucesso e progresso do viewer funcionam; tratamento pré-selecionado no form sem aviso; card de sucesso encolhe e a seção "pula" ~210px |
| 2 | Linguagem do mundo real | 3 | Copy pt-BR clara; jargão sem explicação: "Reabilitação Oral", "Dentística", HUD "arcada_superior.stl", "Distância intercanina" |
| 3 | Controle e liberdade | 3 | Esc fecha menu, modo do viewer para o ciclo; depoimentos giram a cada 7s sem botão de pausa |
| 4 | Consistência | 2 | "Agendar minha avaliação" vai ao form no hero e ao WhatsApp no CTA; 3.800 = "sorrisos" num lugar e "pacientes" em outro; "8 profissionais" com 3 mostrados |
| 5 | Prevenção de erros | 3 | Máscara de telefone, "Ainda não sei", período padrão, validação no blur |
| 6 | Reconhecimento | 3 | Benefícios das 4 tecnologias somem no mobile |
| 7 | Flexibilidade | n/a | Página de persuasão de página única |
| 8 | Estética minimalista | 3 | Contido e bem ritmado, mas H1 cortado ≥1600px; 9 tiras de folha idênticas; faixa morta sob o hero em 1440 |
| 9 | Recuperação de erros | 3 | Mensagens específicas, foco no primeiro campo inválido, dados preservados, aria-live |
| 10 | Ajuda | n/a | Landing sem superfície de ajuda |
| **Total** | | **23/32 (72%)** | **Bom (limite inferior)** |

## Veredito de especificidade

Autoral na maior parte. As linhas-guia do hero (interpupilar, média, curva do sorriso), o viewer com 4 modos que espelham as 4 tecnologias, a régua milimétrica no antes/depois e o mapa como "planta de situação" vêm do planejamento odontológico. Genéricos: faixa de números (com "3D" fingindo ser número), grade de 3 doutores, slider de depoimentos automático e boa parte das fotos de banco (a do processo tem jaleco azul-médico). O sistema de "folhas" sozinho caberia num escritório de arquitetura. Oportunidade perdida: a linguagem de ficha não chega na decisão do paciente (processo e formulário poderiam ser a ficha dele).

Detector: CLI em modo DEGRADADO (regex; módulos de parser ausentes), 0 achados, ou seja, cobertura limitada e não "limpo". Overlay no navegador: 18 anti-padrões. Confirmados: texto de UI 10.5px no HUD do viewer; 8.5px em "Odontologia" do logo (aceitável como lettering); eyebrow do hero (pinado pelo brief); kicker "Folha 07" acima do h2; contraste 3.0:1 no rótulo "T.01" do preview e ~3.4:1 em "Antes/Depois", 3.6:1 em "Arraste para girar". Falsos positivos: padding "apertado" (botões com min-height), overflow recortado no hero e nos retratos (intencional), entrelinha 1.3 nas citações grandes.

## Prioridades

- [P1] H1 do hero cortado em telas ≥1600px (styles.css:237 margin-left de alinhamento + nowrap + overflow hidden nas linhas). Em 1920 lê-se "parece verdadeirame…". Fix: tirar o offset da margem ou trocar nowrap por font-size atrelado à coluna (container query). Comando: /impeccable adapt
- [P1] Antes/depois é a mesma boca com filtro (index.html:357-371, styles.css:454-459): lábios cinza-arroxeados, laterais lascados e canino amarelo continuam no "Depois". Fix: par ilustrativo licenciado real, ou trocar por "atual / planejado" com contorno desenhado na linguagem das guias; no mínimo tirar o filtro dos lábios e pôr "Imagem ilustrativa" dentro do quadro. Comando: /impeccable shape
- [P1] Links prometem conteúdo e jogam no formulário; mesmo rótulo leva a dois canais (tratamentos, "Ver todos", "Conhecer especialista", CTA). Fix: rótulos honestos ("Avaliar implantes →", "Agendar com a Dra. Helena", "Agendar pelo WhatsApp"), remover "Ver todos", ancorar no form e destacar a seleção. Comando: /impeccable clarify
- [P2] Nenhuma tranquilização no ponto de decisão: custo/duração da avaliação, parcelamento, dor/sedação, próximos passos; sucesso genérico e card que encolhe. Fix: 3 fatos curtos (fornecidos pelo cliente), eco do período/WhatsApp no sucesso, min-height estável. Comando: /impeccable clarify
- [P2] Anel de foco dourado 2.56:1 no papel (<3:1, WCAG 1.4.11); descrições das tecnologias ocultas no mobile; rótulos 10.5–11px abaixo do contraste. Fix: foco verde/gold-ink no papel, descrição do modo ativo no mobile, contraste dos rótulos sobre foto. Comando: /impeccable harden

## Personas

- Jordan: clica em "Implantes" e cai num form; termos não explicados; HUD do viewer é ruído; não sabe se a avaliação é paga.
- Riley: arrasta o slider e vê os mesmos dentes; 3.800 com dois significados; "8 profissionais" com 3; H1 cortado em 1920; botão WhatsApp cobre o crédito AJ no rodapé.
- Casey: botão flutuante sobre o canto do formulário e do mapa; carrossel da equipe sem indicador e retratos que nunca ficam coloridos (só hover); rótulos do mapa ~5px.
- Cláudia, 47 (adiando implante): não acha preço/parcelamento nem fala sobre dor; o depoimento sobre medo está escondido no slide 2; antes/depois parece encenado; retratos P&B frios.

## Observações menores

Galeria mistura prédios diferentes e a recepção parece render 3D com legenda "carvalho" sobre nogueira escura; viewer no modo planejamento ainda grande demais (molares sob o HUD); depoimentos sem pausa (WCAG 2.2.2); placeholder do input 2.84:1; T.01 ativo por padrão fica recuado 12px; tablist sem aria-controls/tabpanel; og:image com caminho relativo; crédito "AJ Solutions Tech" aponta para #inicio.

## Perguntas

1. Sem pares reais de antes/depois, por que não mostrar o próprio planejamento (sorriso atual com o contorno planejado desenhado por cima)?
2. Quais 3 fatos verdadeiros a Cláudia precisa ler antes de tocar em "Solicitar agendamento", e o cliente consegue fornecer agora?
3. As 9 tiras "Folha 0X" idênticas se pagam, ou a ficha bateria mais forte em 3–4 momentos-chave?
4. Por que as pessoas que vão tocar no paciente são as únicas imagens P&B e dramáticas numa página que promete acolhimento?
