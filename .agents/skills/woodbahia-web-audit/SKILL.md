---
name: woodbahia-web-audit
description: Audita páginas e aplicações web da Wood Bahia com foco em UX/UI, CRO, geração de leads, SEO, performance, acessibilidade, responsividade, QA, analytics e integridade comercial. Use para diagnosticar páginas do site Wood Bahia antes de implementar melhorias, validar páginas existentes, revisar novas páginas ou investigar queda de qualidade/conversão. Exige evidências e não altera código durante a fase de auditoria.
---

# Wood Bahia Web Audit

Skill profissional para auditoria de páginas, landing pages e aplicações web da Wood Bahia.

O objetivo é identificar problemas reais e oportunidades de melhoria com base em evidências verificáveis, preservando a identidade comercial, a integridade técnica e o objetivo principal do site: geração de leads qualificados.

## Princípio fundamental

AUDITAR PRIMEIRO.

NÃO ALTERAR DEPOIS DE SUPOR.

IMPLEMENTAR SOMENTE APÓS APROVAÇÃO EXPLÍCITA.

Quando esta Skill estiver sendo usada em modo de auditoria:

* não editar arquivos;
* não alterar banco de dados;
* não executar migrations;
* não fazer deploy;
* não alterar variáveis de ambiente;
* não excluir arquivos;
* não alterar integrações;
* não modificar configurações de produção;
* não alterar conteúdo comercial.

A auditoria deve terminar com diagnóstico e recomendações.

Implementação é uma tarefa posterior e separada.

---

# 1. REGRA DE EVIDÊNCIA

Toda afirmação deve ser classificada como uma das seguintes:

## CONFIRMADO

Problema diretamente observado e reproduzido.

Exemplos:

* botão não funciona;
* erro no console;
* requisição retorna erro;
* imagem excessivamente pesada;
* heading incorreto;
* layout quebra em determinada largura;
* formulário não envia;
* evento não é disparado.

Fornecer a evidência.

## HIPÓTESE

Há indícios de um problema, mas não existe evidência suficiente para confirmá-lo.

Explicar:

* o que levou à hipótese;
* como confirmar;
* quais dados seriam necessários.

Nunca apresentar hipótese como fato.

## OPORTUNIDADE

Não existe necessariamente um defeito, mas existe uma melhoria potencial.

Exemplos:

* nova forma de apresentar modelos;
* filtros;
* comparação;
* prova social adicional;
* reorganização de CTAs.

Deixar claro que se trata de recomendação estratégica.

---

# 2. PROIBIÇÃO DE DADOS INVENTADOS

Nunca inventar:

* taxa de conversão;
* número de visitantes;
* taxa de rejeição;
* comportamento de usuários;
* resultados de testes;
* dados de Analytics;
* resultados de Lighthouse;
* Core Web Vitals;
* posicionamento no Google;
* faturamento;
* quantidade de leads;
* impacto percentual esperado.

Se o dado não estiver disponível, declarar:

"Dado não disponível para confirmação."

Pode estimar impacto qualitativamente:

* muito alto;
* alto;
* médio;
* baixo.

Não atribuir percentual fictício.

---

# 3. ENTENDER O CONTEXTO

Antes da auditoria, leia quando disponível:

resources/woodbahia-context.md

Não presumir que o contexto esteja atualizado.

Quando houver divergência entre:

1. código;
2. site publicado;
3. contexto da Skill;
4. informações comerciais fornecidas no pedido;

registre a inconsistência.

Não decidir silenciosamente qual versão está correta.

---

# 4. DEFINIR ESCOPO

Antes de analisar, identificar:

* URL alvo;
* página ou fluxo;
* objetivo comercial;
* público provável;
* ambiente analisado;
* código-fonte disponível ou não;
* acesso a Analytics disponível ou não;
* dispositivos relevantes.

Se informações não estiverem disponíveis, continuar com o que puder ser comprovado e declarar as limitações.

---

# 5. AUDITORIA DE ARQUITETURA

Quando o workspace estiver disponível:

Identificar:

* framework;
* versão relevante;
* biblioteca de UI;
* roteamento;
* estrutura de componentes;
* gerenciamento de estado;
* backend/API;
* banco;
* autenticação;
* armazenamento;
* hospedagem;
* analytics;
* pixels;
* CRM;
* WhatsApp;
* formulários;
* simuladores;
* serviços externos.

Identificar os arquivos e componentes responsáveis pela página auditada.

Não alterar nenhum arquivo.

---

# 6. TESTE DA EXPERIÊNCIA REAL

Sempre que Browser Agent ou navegador estiver disponível, testar a página real.

Executar preferencialmente em:

## Desktop

1920×1080 ou viewport equivalente.

## Notebook

1366×768 ou equivalente.

## Mobile

aproximadamente 390×844 ou dispositivo equivalente.

Testar também larguras intermediárias quando houver comportamento responsivo suspeito.

Verificar:

* carregamento inicial;
* navegação;
* menu;
* anchors;
* scroll;
* botões;
* CTAs;
* links;
* imagens;
* carrosséis;
* modais;
* formulários;
* simuladores;
* WhatsApp;
* footer;
* responsividade;
* teclado;
* estados hover/focus;
* erros visuais.

Não afirmar que algo funciona apenas porque o elemento está presente.

Interagir quando a operação for segura e não produzir efeitos indesejados.

---

# 7. QA TÉCNICO

Verificar:

* console;
* erros JavaScript;
* warnings relevantes;
* Network;
* requisições falhando;
* HTTP 4xx;
* HTTP 5xx;
* assets inexistentes;
* CORS;
* hydration errors;
* erros de renderização;
* links quebrados;
* imagens quebradas;
* problemas de formulário;
* erros de rota.

Registrar evidências.

---

# 8. UX/UI

Avaliar:

* primeira impressão;
* compreensão imediata;
* hierarquia;
* leitura;
* escaneabilidade;
* tipografia;
* espaçamento;
* contraste;
* consistência;
* densidade de informação;
* organização;
* navegação;
* feedback de interação;
* affordances;
* acessibilidade visual;
* experiência mobile.

Pergunta central:

"Um visitante que não conhece a Wood Bahia entende rapidamente o que a empresa vende, onde atende, aproximadamente quanto custa e qual deve ser seu próximo passo?"

---

# 9. CRO — CONVERSION RATE OPTIMIZATION

Mapear o funil principal.

Exemplo:

VISITANTE
→ DESCOBERTA
→ MODELO
→ INTERESSE
→ DETALHES
→ PREÇO
→ SIMULAÇÃO
→ CONTATO
→ LEAD QUALIFICADO.

Analisar:

* CTA primário;
* CTAs secundários;
* competição entre CTAs;
* fricção;
* excesso de decisões;
* clareza da oferta;
* objeções;
* confiança;
* proximidade entre informação e CTA;
* formulários;
* WhatsApp;
* simulador;
* continuidade da jornada.

Não usar dark patterns.

Não criar falsa urgência.

Não recomendar informações comerciais não comprovadas.

---

# 10. MODELOS DE CASAS E CHALÉS

Quando houver catálogo de modelos, analisar cada card e a experiência agregada.

Verificar presença e clareza de:

* fotografia;
* nome;
* metragem;
* quartos;
* banheiros;
* finalidade;
* preço;
* modalidade;
* parcelamento;
* descrição;
* diferenciais;
* CTA.

Avaliar oportunidades como:

* filtros por metragem;
* número de quartos;
* finalidade;
* faixa de investimento;
* modalidade;
* ordenação;
* busca;
* comparação;
* página individual;
* galeria;
* planta baixa;
* vídeo;
* tour;
* obras reais;
* depoimentos daquele modelo;
* botão de interesse;
* simulador pré-preenchido.

Classificar como oportunidade, não como obrigação.

---

# 11. CONFIANÇA E PROVA SOCIAL

Auditar:

* fotos reais;
* vídeos reais;
* obras em andamento;
* obras concluídas;
* showroom;
* avaliações;
* depoimentos;
* Instagram;
* garantia;
* materiais;
* processo construtivo;
* localização;
* regiões atendidas;
* equipe;
* contatos;
* políticas;
* informações empresariais.

Verificar se afirmações relevantes são sustentáveis e coerentes.

Sinalizar alegações absolutas ou potencialmente enganosas.

---

# 12. INTEGRIDADE COMERCIAL

Comparar informações repetidas no site.

Especial atenção para:

* preços;
* promoções;
* parcelamento;
* garantia;
* prazo;
* raio de atendimento;
* regiões atendidas;
* itens inclusos;
* itens não inclusos;
* modalidade Kit;
* Montagem Parceira;
* Chave na Mão;
* projetos personalizados.

Classificar divergências encontradas como:

COMERCIAL-CRÍTICA
COMERCIAL-IMPORTANTE
COMERCIAL-MENOR

Nunca corrigir silenciosamente.

---

# 13. SEO

Auditar quando tecnicamente possível:

* title;
* meta description;
* canonical;
* robots;
* sitemap;
* H1;
* H2;
* H3;
* HTML semântico;
* conteúdo;
* links internos;
* URLs;
* indexabilidade;
* alt text;
* Open Graph;
* Twitter cards;
* structured data;
* Schema.org;
* SEO local;
* conteúdo duplicado;
* páginas órfãs;
* crawlability.

Avaliar intenção de busca, não apenas palavras-chave.

Não recomendar keyword stuffing.

---

# 14. PERFORMANCE

Verificar:

* peso da página;
* imagens;
* WebP;
* AVIF;
* dimensões;
* lazy loading;
* preloading;
* fontes;
* JavaScript;
* CSS;
* third-party scripts;
* caching;
* code splitting;
* rendering;
* hydration;
* requests;
* DOM excessivo.

Quando métricas reais estiverem disponíveis, avaliar:

* LCP;
* CLS;
* INP;
* TTFB;
* FCP.

Não inventar resultados.

Distinguir:

LAB DATA
FIELD DATA

quando aplicável.

---

# 15. ACESSIBILIDADE

Verificar pelo menos:

* HTML semântico;
* contraste;
* tamanho de texto;
* labels;
* alt text;
* teclado;
* foco;
* ordem do foco;
* headings;
* landmarks;
* formulários;
* aria;
* botões;
* links;
* mensagens de erro;
* zoom;
* touch targets.

Usar WCAG como referência quando pertinente.

---

# 16. MOBILE

Mobile não deve ser apenas redução do desktop.

Analisar especificamente:

* primeira dobra;
* menu;
* cards;
* CTAs;
* imagens;
* textos;
* formulários;
* sliders;
* tabelas;
* touch;
* sticky elements;
* WhatsApp;
* scroll horizontal;
* performance;
* layout shift.

---

# 17. ANALYTICS E TRACKING

Investigar ferramentas existentes.

Verificar possibilidade de medir:

* page_view;
* model_view;
* model_click;
* simulator_start;
* simulator_complete;
* whatsapp_click;
* quote_request;
* form_start;
* form_submit;
* phone_click;
* showroom_interest;
* project_custom_interest.

Quando relevante, recomendar propriedades:

* model_name;
* model_id;
* model_area;
* model_category;
* modality;
* page_location;
* lead_source;
* utm_source;
* utm_medium;
* utm_campaign.

Não alterar tracking sem aprovação.

---

# 18. LEADS E CRM

Quando houver integração:

Mapear:

SITE
→ EVENTO
→ FORMULÁRIO/SIMULADOR
→ API
→ CRM
→ LEAD
→ ORIGEM
→ MODELO
→ CONSULTOR.

Verificar se dados importantes são preservados durante a jornada.

Não manipular leads reais durante testes sem autorização explícita.

---

# 19. SEGURANÇA BÁSICA RELACIONADA À PÁGINA

Sem substituir uma auditoria de segurança dedicada, registrar:

* secrets expostos;
* tokens no frontend;
* endpoints sensíveis;
* dados pessoais expostos;
* configuração insegura evidente;
* mensagens de erro com informação sensível.

Não executar exploração ofensiva.

Se for necessário pentest, recomendar auditoria de segurança separada.

---

# 20. PRIORIZAÇÃO

Cada achado deverá receber:

## P0 — CRÍTICO

Quebra funcional, segurança, risco comercial grave ou impossibilidade de conversão.

## P1 — ALTO

Grande impacto provável na experiência, conversão, SEO ou negócio.

## P2 — MÉDIO

Melhoria relevante, porém não urgente.

## P3 — BAIXO

Refinamento ou otimização futura.

Além da prioridade, atribuir:

IMPACTO:

* muito alto;
* alto;
* médio;
* baixo.

ESFORÇO:

* pequeno;
* médio;
* grande.

RISCO DE IMPLEMENTAÇÃO:

* baixo;
* médio;
* alto.

---

# 21. MATRIZ IMPACTO × ESFORÇO

Organizar recomendações também em:

## QUICK WINS

Alto impacto + baixo esforço.

## PROJETOS ESTRATÉGICOS

Alto impacto + alto esforço.

## MELHORIAS INCREMENTAIS

Baixo/médio impacto + baixo esforço.

## BAIXA PRIORIDADE

Baixo impacto + alto esforço.

---

# 22. RELATÓRIO

Ao finalizar, ler:

resources/audit-report-template.md

Usar essa estrutura para o relatório final.

O relatório deverá conter evidência suficiente para que outra pessoa consiga entender por que cada problema foi identificado.

---

# 23. ROADMAP

Criar roadmap, mas NÃO implementar.

Separar preferencialmente em:

FASE 0 — correções críticas
FASE 1 — integridade comercial e bugs
FASE 2 — CRO e geração de leads
FASE 3 — UX/UI e mobile
FASE 4 — catálogo/modelos
FASE 5 — SEO
FASE 6 — performance
FASE 7 — analytics e CRM
FASE 8 — refinamentos

A ordem pode mudar conforme evidências.

---

# 24. DEFINITION OF DONE DA AUDITORIA

Uma auditoria só pode ser considerada concluída quando:

* escopo estiver claro;
* página real tiver sido analisada quando possível;
* código tiver sido analisado quando disponível;
* desktop tiver sido verificado;
* mobile tiver sido verificado;
* interações relevantes tiverem sido testadas;
* problemas técnicos tiverem evidências;
* hipóteses estiverem identificadas como hipóteses;
* oportunidades estiverem separadas de bugs;
* prioridades tiverem justificativa;
* relatório final estiver completo;
* roadmap tiver sido apresentado;
* nenhuma alteração de produção tiver sido feita.

---

# 25. REGRA FINAL

Durante auditoria:

DIAGNOSTICAR ≠ IMPLEMENTAR.

Se o usuário disser apenas:

"Audite esta página"

realize a auditoria e pare.

Somente entrar em implementação quando houver instrução explícita posterior autorizando as mudanças.
