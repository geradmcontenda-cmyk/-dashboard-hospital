# 📋 Guia de Atualização e Manutenção do Dashboard

**Hospital e Maternidade Miquelina Franco e Elisa Padilha**  
**Instituto Patris Filial Contenda**

---

## 🎯 Objetivo

Este guia descreve como atualizar os dados do dashboard mensalmente e realizar manutenção básica do sistema.

---

## 📊 Estrutura de Dados

O dashboard utiliza um arquivo JSON (`dashboard_data.json`) que contém todos os dados. Este arquivo é gerado automaticamente a partir dos arquivos Excel fornecidos.

### Estrutura do JSON:

```json
{
  "atendimento_geral_mensal": [...],
  "atendimento_risco": [...],
  "atendimento_sexo": [...],
  "atendimento_municipio": [...],
  "atendimento_cid": [...],
  "procedimentos": [...],
  "exames_laboratoriais": [...],
  "radiografias": [...],
  "internacoes_tipo": [...],
  "logistica_oxigenio": [...],
  "logistica_lavanderia": [...],
  "logistica_residuos": [...],
  "logistica_transporte": [...]
}
```

---

## 🔄 Processo de Atualização Mensal

### Opção 1: Atualização Manual (Recomendada)

**Passo 1: Preparar os arquivos Excel**

1. Obtenha os arquivos Excel atualizados do departamento de estatística
2. Organize os arquivos em uma pasta com a seguinte estrutura:

```
dados_mes/
├── [ATENDIMENTO] Geral 2025-04.xlsx
├── [ATENDIMENTO] Risco 2025-04.xlsx
├── [ATENDIMENTO] Sexo 2025-04.xlsx
├── [ATENDIMENTO] Municipio 2025-04.xlsx
├── [ATENDIMENTO] CID 2025-04.xlsx
├── [PROCEDIMENTOS] 2025-04.xlsx
├── [EXAMES] Laboratoriais 2025-04.xlsx
├── [EXAMES] Radiografia 2025-04.xlsx
├── [INTERNACAO] Tipo 2025-04.xlsx
├── [LOGISTICA] Oxigenio 2025-04.xlsx
├── [LOGISTICA] Lavanderia 2025-04.xlsx
├── [LOGISTICA] Residuos 2025-04.xlsx
└── [LOGISTICA] Transporte 2025-04.xlsx
```

**Passo 2: Processar os dados**

Se você tiver Python instalado:

```bash
# Executar o script de processamento
python3 generate_final_data.py

# Isso gerará um novo dashboard_data.json
```

**Passo 3: Atualizar o repositório**

1. Acesse seu repositório GitHub: https://github.com/geradmcontenda-cmyk/-dashboard-hospital
2. Clique em **"Add file"** > **"Upload files"**
3. Selecione o novo arquivo `dashboard_data.json`
4. Clique em **"Commit changes"**
5. O GitHub Pages atualizará automaticamente em alguns segundos

**Passo 4: Verificar a atualização**

Acesse o dashboard: https://geradmcontenda-cmyk.github.io/-dashboard-hospital/

Os novos dados devem aparecer automaticamente!

---

### Opção 2: Atualização Direta no GitHub (Mais Simples)

Se você não tem Python instalado, pode editar o arquivo JSON diretamente:

1. Acesse: https://github.com/geradmcontenda-cmyk/-dashboard-hospital
2. Clique no arquivo `dashboard_data.json`
3. Clique no ícone de **lápis** (Edit)
4. Modifique os dados conforme necessário
5. Clique em **"Commit changes"**

---

## 📝 Formato dos Dados

Cada seção do JSON segue um padrão específico:

### Atendimento Geral Mensal
```json
{
  "Mes": "2025-04-01",
  "Quantidade": 2531
}
```

### Atendimento por Risco
```json
{
  "Classificacao": "Atendimento Imediato",
  "Quantidade": 57
}
```

### Atendimento por Sexo
```json
{
  "Sexo": "Feminino",
  "Quantidade": 20113
}
```

### Atendimento por Município
```json
{
  "Municipio": "Contenda",
  "Quantidade": 15000
}
```

### Atendimento por CID
```json
{
  "CID_Full": "Z12.9 - Exame de rastreamento para neoplasia, não especificado",
  "Quantidade": 150,
  "Mes": "2025-04-01"
}
```

### Procedimentos
```json
{
  "Procedimento": "0101010 - Procedimento X",
  "Quantidade": 50,
  "Mes": "2025-04-01"
}
```

### Exames Laboratoriais
```json
{
  "Exame": "0001 - Glicose",
  "Quantidade": 1000,
  "Mes": "2025-04-01"
}
```

### Radiografias
```json
{
  "Exame": "0001 - Radiografia de Tórax",
  "Quantidade": 100,
  "Mes": "2025-04-01"
}
```

### Internações por Tipo
```json
{
  "Tipo": "Clínica",
  "Quantidade": 300,
  "Mes": "2025-04-01"
}
```

### Logística - Oxigênio
```json
{
  "Tipo": "Cilindro Grande",
  "M3": 1500,
  "Mes": "2025-04-01"
}
```

### Logística - Lavanderia
```json
{
  "Peso": 1500,
  "Mes": "2025-04-01"
}
```

### Logística - Resíduos
```json
{
  "Grupo": "Infectante",
  "KG": 500,
  "Mes": "2025-04-01"
}
```

### Logística - Transporte
```json
{
  "Destino": "Hospital Central",
  "Quantidade": 50,
  "Mes": "2025-04-01"
}
```

---

## 🛠️ Troubleshooting

### O dashboard não atualiza após fazer upload

**Solução:**
1. Aguarde 2-3 minutos para o GitHub Pages processar
2. Limpe o cache do navegador (Ctrl+Shift+Delete)
3. Acesse novamente a URL

### Os dados aparecem em branco

**Solução:**
1. Verifique se o JSON está em formato válido
2. Abra o console (F12) e procure por mensagens de erro
3. Verifique se todos os campos obrigatórios estão preenchidos

### Um gráfico não aparece

**Solução:**
1. Verifique se há dados para esse gráfico
2. Recarregue a página (F5)
3. Limpe o cache (Ctrl+Shift+Delete)

---

## 📱 Acesso ao Dashboard

**URL Pública:**
```
https://geradmcontenda-cmyk.github.io/-dashboard-hospital/
```

**Funcionalidades:**
- ✅ Acesso de qualquer dispositivo (desktop, tablet, mobile)
- ✅ Sem necessidade de instalação
- ✅ Atualização automática após commit no GitHub
- ✅ Compartilhável via link

---

## 🔐 Segurança

- O repositório é **público**, então qualquer pessoa com o link pode visualizar
- Os dados são **somente leitura** no dashboard
- Apenas você pode fazer alterações (via GitHub)

Se precisar de privacidade, entre em contato para configurar um repositório privado.

---

## 📞 Suporte

Para dúvidas ou problemas:

1. Consulte este guia
2. Verifique o console do navegador (F12)
3. Contate o departamento de TI

---

## 📋 Checklist de Atualização Mensal

- [ ] Obter arquivos Excel atualizados
- [ ] Processar dados (se usando Python)
- [ ] Fazer upload do novo `dashboard_data.json`
- [ ] Aguardar 2-3 minutos para atualização
- [ ] Verificar se os dados aparecem corretamente
- [ ] Testar filtros (período, risco, sexo, município)
- [ ] Testar em diferentes navegadores
- [ ] Comunicar à diretoria que os dados foram atualizados

---

## 🎓 Dicas Úteis

1. **Backup:** Sempre mantenha uma cópia dos arquivos Excel originais
2. **Versionamento:** O GitHub mantém histórico de todas as alterações
3. **Testes:** Sempre teste em um ambiente de desenvolvimento antes de atualizar
4. **Documentação:** Mantenha este guia atualizado com novos procedimentos

---

**Última atualização:** Abril de 2025

*Desenvolvido para facilitar a manutenção e atualização contínua do dashboard hospitalar*
