# 📋 Guia de Manutenção - Dashboard Hospitalar HMC

**Hospital e Maternidade Miquelina Franco e Elisa Padilha**  
**Instituto Patris Filial Contenda (CNPJ: 37.678.845/0006-55)**  
**Contenda - PR**

---

## 📑 Índice

1. [Visão Geral](#visão-geral)
2. [Estrutura de Arquivos](#estrutura-de-arquivos)
3. [Como Atualizar Dados Mensais](#como-atualizar-dados-mensais)
4. [Descrição das Abas](#descrição-das-abas)
5. [Interpretação dos Indicadores](#interpretação-dos-indicadores)
6. [Troubleshooting](#troubleshooting)
7. [Contato e Suporte](#contato-e-suporte)

---

## 🎯 Visão Geral

O Dashboard Hospitalar é uma ferramenta interativa de análise de dados que consolida informações operacionais, de atendimento, assistenciais e logísticas do Hospital e Maternidade Miquelina Franco e Elisa Padilha.

**Características principais:**
- ✅ 5 abas temáticas com visualizações interativas
- ✅ Filtros dinâmicos por período, risco, sexo e município
- ✅ Gráficos em tempo real com Chart.js
- ✅ Responsivo para desktop e mobile
- ✅ Fácil atualização mensal de dados

---

## 📁 Estrutura de Arquivos

```
dashboard_hospital_final/
├── index.html                    # Arquivo principal do dashboard
├── dashboard.js                  # Lógica e interatividade
├── dashboard_data.json           # Dados consolidados (ATUALIZAR MENSALMENTE)
├── logo_contenda.png             # Logo da Prefeitura
├── logo_hmc.png                  # Logo do Hospital
├── logo_patris.png               # Logo do Instituto Patris
└── README.md                     # Este arquivo
```

---

## 🔄 Como Atualizar Dados Mensais

### Passo 1: Preparar os Arquivos Excel

Solicite ao departamento de TI/Estatística os seguintes arquivos Excel atualizados:

**Bloco de Atendimento (11 arquivos):**
- `QUANTIDADE DE ATENDIMENTO GERAL.xlsx`
- `QUANTIDADE DE ATENDIMENTO GERAL - POR CID.xlsx`
- `QUANTIDADE DE ATENDIMENTO GERAL - POR CLASSIFICAÇÃO DE RISCO.xlsx`
- `QUANTIDADE DE ATENDIMENTO GERAL - POR FAIXA ETÁRIA.xlsx`
- `QUANTIDADE DE ATENDIMENTO GERAL - POR LIMITE DE TEMPO.xlsx`
- `QUANTIDADE DE ATENDIMENTO GERAL - POR MUNICIPIO.xlsx`
- `QUANTIDADE DE ATENDIMENTO GERAL - POR SEXO.xlsx`
- `QUANTIDADE TOTAL DE RECEPCIONADOS.xlsx`
- `QUANTIDADE TOTAL DE PROCEDIMENTOS - POR MÊS.xlsx`
- `QUANTIDADE TOTAL DE RADIOGRAFIA - POR MÊS.xlsx`
- `QUANTIDADE TOTAL DE EXAMES LABORATORIAIS - POR MÊS.xlsx`

**Bloco de Internação (3 arquivos):**
- `QUANTIDADE TOTAL DE INTERNAÇÕES - POR MUNICIPIO.xlsx`
- `QUANTIDADE TOTAL DE INTERNAÇÕES - POR SEXO.xlsx`
- `QUANTIDADE TOTAL DE INTERNAÇÕES - POR TIPO.xlsx`

**Bloco Assistencial e Logístico (5 arquivos):**
- `[ASSISTENCIAL] CILINDROS DE OXIGENIO E AR COMPRIMIDO - CONSUMO.xlsx`
- `[SERVIÇO DE APOIO] [LAVANDERIA] SAIDAS DE ROUPA SUJA POR DATA E LITRO.xlsx`
- `[SERVIÇO DE APOIO] [RESIDUOS] COLETA DE RESIDUOS PERIGOSOS - POR DATA E GRUPO.xlsx`
- `[TRANSPORTE] REMOÇÕES POR DATA E DESTINO.xlsx`
- `[RH] MOVIMENTAÇÃO 2025-2026.xlsx`

### Passo 2: Executar o Script de Processamento

1. Coloque todos os arquivos Excel em uma pasta (ex: `/home/ubuntu/dashboard_project`)
2. Execute o script de processamento:

```bash
python3 /home/ubuntu/process_data.py
```

3. Gere o JSON consolidado:

```bash
python3 /home/ubuntu/generate_final_data.py
```

### Passo 3: Atualizar o Dashboard

1. Substitua o arquivo `dashboard_data.json` na pasta do dashboard
2. Abra o `index.html` no navegador
3. Os dados serão carregados automaticamente

---

## 📊 Descrição das Abas

### 🏥 Painel Executivo
**Visão geral da instituição com KPIs principais:**
- Total de atendimentos
- Total de internações
- Exames laboratoriais
- Radiografias
- Procedimentos
- Gráfico de evolução mensal

**Uso:** Apresentação à direção, relatórios executivos

---

### 📊 Atendimento
**Análise detalhada de atendimentos:**
- Distribuição por classificação de risco (Imediato, 10min, 60min, 120min, 240min)
- Distribuição por sexo (Masculino, Feminino, Indeterminado)
- Distribuição por município
- Top 20 CID mais frequentes
- Tabela completa de CID com filtros

**Uso:** Análise clínica, planejamento de recursos, identificação de padrões

---

### 🩺 Assistencial
**Dados de procedimentos e consumo de insumos:**
- Consumo de oxigênio por tipo de cilindro (T, A, G)
- Top 10 exames laboratoriais
- Top 10 radiografias
- Top 10 procedimentos
- KPIs de consumo

**Uso:** Gestão de insumos, planejamento de compras, análise de eficiência

---

### 🚑 Operacional
**Indicadores de operações e logística:**
- Internações por tipo (Internação vs Observação)
- Remoções por destino
- Coleta de resíduos por grupo
- Saídas de lavanderia (peso em KG)
- KPIs operacionais

**Uso:** Gestão de recursos, planejamento logístico, sustentabilidade

---

### 🔍 Insights
**Análise de correlações e recomendações:**
- Correlação: Atendimentos vs Consumo de Oxigênio
- Correlação: Atendimentos vs Remoções
- Correlação: Atendimentos vs Resíduos
- Análise de sazonalidade
- Recomendações estratégicas

**Uso:** Tomada de decisão, planejamento estratégico, otimização de processos

---

## 📈 Interpretação dos Indicadores

### Classificação de Risco
- **Atendimento Imediato:** Emergências que requerem atendimento imediato
- **10 Minutos:** Urgências que devem ser atendidas em até 10 minutos
- **60 Minutos:** Situações de urgência que permitem espera de até 1 hora
- **120 Minutos:** Casos menos urgentes que podem aguardar até 2 horas
- **240 Minutos:** Casos eletivos ou de menor urgência

### Taxa de Ocupação
Calculada como: (Total de Internações / Total de Atendimentos) × 100

**Interpretação:**
- Baixa taxa: Capacidade ociosa
- Taxa adequada: 70-85% (recomendado)
- Alta taxa: Risco de sobrecarga

### Sazonalidade
Observe os picos de atendimento ao longo dos meses para:
- Planejar férias e escalas
- Dimensionar estoques de insumos
- Antecipar demandas de recursos

---

## 🛠️ Troubleshooting

### Problema: Dashboard não carrega os dados

**Solução:**
1. Verifique se o arquivo `dashboard_data.json` está na mesma pasta que `index.html`
2. Abra o console do navegador (F12) e procure por mensagens de erro
3. Certifique-se de que o arquivo JSON está válido (use um validador JSON online)

### Problema: Gráficos não aparecem

**Solução:**
1. Verifique a conexão com a internet (Chart.js é carregado via CDN)
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Tente em outro navegador

### Problema: Filtros não funcionam

**Solução:**
1. Recarregue a página (F5)
2. Verifique se os dados estão no formato correto no JSON
3. Abra o console (F12) e procure por erros de JavaScript

### Problema: Dados incorretos após atualização

**Solução:**
1. Verifique se os arquivos Excel têm o formato correto
2. Certifique-se de que as datas estão no formato "YYYY-MM-DD" ou "Mês/YYYY"
3. Execute novamente o script de processamento
4. Valide o JSON gerado

---

## 📞 Contato e Suporte

Para dúvidas, sugestões ou problemas técnicos, entre em contato com:

**Departamento de TI:**
- Email: ti@hospital.com.br
- Ramal: XXXX

**Departamento de Estatística:**
- Email: estatistica@hospital.com.br
- Ramal: XXXX

---

## 📝 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|-----------|
| 1.0 | Abril/2025 | Versão inicial do dashboard |
| | | |

---

## 📋 Checklist de Atualização Mensal

- [ ] Solicitar arquivos Excel atualizados
- [ ] Verificar integridade dos arquivos
- [ ] Executar script de processamento
- [ ] Gerar novo JSON consolidado
- [ ] Atualizar arquivo `dashboard_data.json`
- [ ] Testar dashboard em navegador
- [ ] Validar dados apresentados
- [ ] Fazer backup dos dados anteriores
- [ ] Documentar alterações (se houver)

---

## 🔒 Segurança e Privacidade

- O dashboard é uma aplicação web estática (HTML + JavaScript)
- Todos os dados são processados localmente no navegador
- Não há transmissão de dados para servidores externos
- Recomenda-se usar em rede interna/VPN para maior segurança

---

## 📚 Referências

- [Chart.js Documentation](https://www.chartjs.org/)
- [MDN Web Docs - JavaScript](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
- [HTML5 Specification](https://html.spec.whatwg.org/)

---

**Documento preparado para:** Hospital e Maternidade Miquelina Franco e Elisa Padilha  
**Data de criação:** Abril de 2025  
**Versão:** 1.0
