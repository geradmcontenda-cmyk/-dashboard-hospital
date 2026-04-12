# 🏥 Dashboard Hospitalar - HMC

**Hospital e Maternidade Miquelina Franco e Elisa Padilha**  
**Instituto Patris Filial Contenda | CNPJ: 37.678.845/0006-55**

---

## 📊 Visão Geral

Dashboard interativo para análise consolidada de dados operacionais, de atendimento, assistenciais e logísticos do hospital, com suporte a filtros dinâmicos e múltiplas visualizações em tempo real.

---

## 📦 Arquivos Inclusos

| Arquivo | Descrição |
|---------|-----------|
| `index.html` | Dashboard interativo principal |
| `dashboard.js` | Lógica e interatividade do dashboard |
| `dashboard_data.json` | Dados consolidados (atualizar mensalmente) |
| `Excel_Consolidado_Hospital.xlsx` | Planilha com todos os dados processados |
| `Relatorio_Dashboard_Hospitalar.pdf` | Relatório em PDF para apresentações |
| `Relatorio_Dashboard_Hospitalar.html` | Relatório em HTML (alternativa) |
| `GUIA_MANUTENCAO_DASHBOARD.md` | Guia completo de manutenção |
| `logo_*.png` | Logos institucionais (3 arquivos) |

---

## 🚀 Como Usar

### Opção 1: Abrir Localmente (Recomendado)

1. Baixe todos os arquivos para uma pasta
2. Abra o arquivo `index.html` em um navegador web moderno
3. O dashboard carregará automaticamente com os dados

**Navegadores suportados:**
- Chrome/Chromium (recomendado)
- Firefox
- Safari
- Edge

### Opção 2: Servidor Web Local

Se preferir servir via HTTP:

```bash
# Python 3
python3 -m http.server 8000

# Node.js
npx http-server

# PHP
php -S localhost:8000
```

Acesse: `http://localhost:8000`

---

## 📋 Abas Disponíveis

### 🏥 Painel Executivo
Visão geral com KPIs principais e evolução mensal de atendimentos.

### 📊 Atendimento
Análise detalhada de atendimentos por risco, sexo, município e CID.

### 🩺 Assistencial
Dados de procedimentos, exames laboratoriais, radiografias e consumo de oxigênio.

### 🚑 Operacional
Internações, remoções, resíduos e operações de lavanderia.

### 🔍 Insights
Correlações entre variáveis e recomendações estratégicas.

---

## 🔧 Filtros Disponíveis

- **Período (Mês):** Selecione um mês específico ou visualize todos
- **Classificação de Risco:** Filtre por nível de urgência
- **Sexo:** Masculino, Feminino ou todos
- **Município:** Selecione um município ou todos

Os filtros funcionam em tempo real em todas as abas.

---

## 📈 Indicadores Principais

| Indicador | Descrição |
|-----------|-----------|
| Total de Atendimentos | Volume total de pacientes atendidos |
| Taxa de Ocupação | Internações em relação aos atendimentos |
| Consumo de Oxigênio | Volume em M³ por tipo de cilindro |
| Exames Laboratoriais | Quantidade total de exames realizados |
| Procedimentos | Total de procedimentos executados |
| Radiografias | Quantidade de exames radiológicos |
| Resíduos | Coleta por grupo (infectante, químico, comum) |
| Lavanderia | Peso de roupas processadas |

---

## 🔄 Atualização Mensal de Dados

1. Obtenha os arquivos Excel atualizados do departamento de estatística
2. Execute o script de processamento:
   ```bash
   python3 process_data.py
   ```
3. Gere o novo JSON:
   ```bash
   python3 generate_final_data.py
   ```
4. Substitua o arquivo `dashboard_data.json`
5. Recarregue o dashboard no navegador

Consulte `GUIA_MANUTENCAO_DASHBOARD.md` para instruções detalhadas.

---

## 📊 Formatos de Dados Suportados

Os dados devem estar em formato Excel (.xlsx) com as seguintes estruturas:

**Atendimentos:**
- Coluna: MÊS, Quantidade, Classificação de Risco, Sexo, Município, CID

**Logística:**
- Coluna: Data, Quantidade/Peso/Volume, Tipo/Grupo

**Internações:**
- Coluna: Mês, Tipo, Quantidade

---

## 🎨 Customização

### Alterar Cores
Edite o arquivo `dashboard.js` e procure por valores hexadecimais de cor (#0066cc, etc.)

### Adicionar Novos Gráficos
1. Adicione um novo `<canvas>` no HTML
2. Crie uma função `renderChartXXX()` no JavaScript
3. Chame a função na renderização da aba

### Modificar Layout
Edite o CSS no `<style>` do `index.html`

---

## 🐛 Troubleshooting

**Dashboard não carrega:**
- Verifique se `dashboard_data.json` está na mesma pasta
- Abra o console (F12) para ver mensagens de erro

**Gráficos não aparecem:**
- Limpe o cache (Ctrl+Shift+Delete)
- Verifique conexão com internet (Chart.js via CDN)

**Filtros não funcionam:**
- Recarregue a página (F5)
- Verifique formato dos dados no JSON

---

## 📞 Suporte

Para dúvidas ou problemas:
- Consulte `GUIA_MANUTENCAO_DASHBOARD.md`
- Contate o departamento de TI
- Verifique o console do navegador (F12)

---

## 📋 Requisitos Técnicos

- **Navegador:** Moderno com suporte a ES6+
- **JavaScript:** Habilitado
- **Conexão:** Internet (para carregar Chart.js via CDN)
- **Espaço:** ~3MB para todos os arquivos

---

## 📄 Licença e Atribuições

- **Chart.js:** https://www.chartjs.org/
- **Desenvolvimento:** Dashboard Hospitalar v1.0
- **Instituição:** Hospital e Maternidade Miquelina Franco e Elisa Padilha

---

## 📝 Histórico de Versões

| Versão | Data | Alterações |
|--------|------|-----------|
| 1.0 | Abril/2025 | Lançamento inicial |

---

**Desenvolvido com ❤️ para melhor gestão hospitalar**

*Última atualização: Abril de 2025*
