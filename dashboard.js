// Variáveis globais
let allData = {};
let charts = {};

// Carregar dados
async function loadData() {
    try {
        const response = await fetch('./dashboard_data.json');
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        const text = await response.text();
        allData = JSON.parse(text);
        initializeFilters();
        renderExecutivo();
    } catch (error) {
        console.error('Erro ao carregar dados:', error);
    }
}

// Inicializar filtros
function initializeFilters() {
    const meses = new Set();
    const riscos = new Set();
    const sexos = new Set();
    const municipios = new Set();

    if (allData.atendimento_geral_mensal) {
        allData.atendimento_geral_mensal.forEach(row => {
            if (row.Mes) meses.add(row.Mes);
        });
    }

    if (allData.atendimento_risco) {
        allData.atendimento_risco.forEach(row => {
            if (row.Classificacao) riscos.add(row.Classificacao);
        });
    }

    if (allData.atendimento_sexo) {
        allData.atendimento_sexo.forEach(row => {
            if (row.Sexo) sexos.add(row.Sexo);
        });
    }

    if (allData.atendimento_municipio) {
        allData.atendimento_municipio.forEach(row => {
            if (row.Municipio) municipios.add(row.Municipio);
        });
    }

    populateSelect('filterMes', Array.from(meses).sort());
    populateSelect('filterRisco', Array.from(riscos).sort());
    populateSelect('filterSexo', Array.from(sexos).sort());
    populateSelect('filterMunicipio', Array.from(municipios).sort());

    document.getElementById('filterMes').addEventListener('change', applyFilters);
    document.getElementById('filterRisco').addEventListener('change', applyFilters);
    document.getElementById('filterSexo').addEventListener('change', applyFilters);
    document.getElementById('filterMunicipio').addEventListener('change', applyFilters);
}

function populateSelect(elementId, values) {
    const select = document.getElementById(elementId);
    values.forEach(value => {
        const option = document.createElement('option');
        option.value = value;
        option.textContent = value;
        select.appendChild(option);
    });
}

function getFilteredData() {
    const mes = document.getElementById('filterMes').value;
    const risco = document.getElementById('filterRisco').value;
    const sexo = document.getElementById('filterSexo').value;
    const municipio = document.getElementById('filterMunicipio').value;

    const filtered = {};
    for (const key in allData) {
        filtered[key] = allData[key].filter(row => {
            let match = true;
            if (mes && row.Mes && row.Mes !== mes) match = false;
            if (risco && row.Classificacao && row.Classificacao !== risco) match = false;
            if (sexo && row.Sexo && row.Sexo !== sexo) match = false;
            if (municipio && row.Municipio && row.Municipio !== municipio) match = false;
            return match;
        });
    }
    return filtered;
}

function applyFilters() {
    const activeTab = document.querySelector('.tab-content.active');
    if (!activeTab) return;
    
    const tabId = activeTab.id;
    if (tabId === 'executivo') renderExecutivo();
    else if (tabId === 'atendimento') renderAtendimento();
    else if (tabId === 'assistencial') renderAssistencial();
    else if (tabId === 'operacional') renderOperacional();
    else if (tabId === 'insights') renderInsights();
}

function formatMes(mesStr) {
    if (!mesStr) return '-';
    const [year, month] = mesStr.split('-');
    const monthNames = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
    return `${monthNames[parseInt(month) - 1]}/${year}`;
}

// ===== PAINEL EXECUTIVO =====
function renderExecutivo() {
    const data = getFilteredData();
    
    const container = document.getElementById('kpiExecutivo');
    if (!container) return;
    container.innerHTML = '';

    const totalAtendimentos = (data.atendimento_geral_mensal || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const totalInternacoes = (data.internacoes_tipo || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const totalExamesLab = (data.exames_laboratoriais || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const totalRadiografias = (data.radiografias || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const totalProcedimentos = (data.procedimentos || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);

    const kpis = [
        { title: 'Total de Atendimentos', value: totalAtendimentos, class: 'primary' },
        { title: 'Total de Internações', value: totalInternacoes, class: 'secondary' },
        { title: 'Exames Laboratoriais', value: totalExamesLab, class: 'primary' },
        { title: 'Radiografias', value: totalRadiografias, class: 'secondary' },
        { title: 'Procedimentos', value: totalProcedimentos, class: 'warning' }
    ];

    kpis.forEach(kpi => {
        const card = document.createElement('div');
        card.className = `kpi-card ${kpi.class}`;
        card.innerHTML = `<h3>${kpi.title}</h3><div class="value">${kpi.value.toLocaleString('pt-BR')}</div>`;
        container.appendChild(card);
    });

    renderChartEvolucao(data);
}

function renderChartEvolucao(data) {
    const chartData = data.atendimento_geral_mensal || [];
    const sorted = chartData.sort((a, b) => a.Mes.localeCompare(b.Mes));

    const canvas = document.getElementById('chartEvolucao');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.evolucao) charts.evolucao.destroy();

    charts.evolucao = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sorted.map(row => formatMes(row.Mes)),
            datasets: [{
                label: 'Atendimentos',
                data: sorted.map(row => parseInt(row.Quantidade || 0)),
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 6,
                pointBackgroundColor: '#0066cc'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ===== ABA ATENDIMENTO =====
function renderAtendimento() {
    const data = getFilteredData();
    
    renderKPIAtendimento(data);
    renderChartRisco(data);
    renderChartSexo(data);
    renderChartMunicipio(data);
    renderTableCID(data);
}

function renderKPIAtendimento(data) {
    const container = document.getElementById('kpiAtendimento');
    if (!container) return;
    container.innerHTML = '';

    const imediato = (data.atendimento_risco || []).filter(r => r.Classificacao.includes('Imediato')).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const dez_min = (data.atendimento_risco || []).filter(r => r.Classificacao.includes('10')).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const sessenta_min = (data.atendimento_risco || []).filter(r => r.Classificacao.includes('60')).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const cento_vinte = (data.atendimento_risco || []).filter(r => r.Classificacao.includes('120')).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const duzentos_quarenta = (data.atendimento_risco || []).filter(r => r.Classificacao.includes('240')).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);

    const kpis = [
        { title: 'Imediato', value: imediato, class: 'warning' },
        { title: '10 Min', value: dez_min, class: 'primary' },
        { title: '60 Min', value: sessenta_min, class: 'secondary' },
        { title: '120 Min', value: cento_vinte, class: 'primary' },
        { title: '240 Min', value: duzentos_quarenta, class: 'secondary' }
    ];

    kpis.forEach(kpi => {
        const card = document.createElement('div');
        card.className = `kpi-card ${kpi.class}`;
        card.innerHTML = `<h3>${kpi.title}</h3><div class="value">${kpi.value.toLocaleString('pt-BR')}</div>`;
        container.appendChild(card);
    });
}

function renderChartRisco(data) {
    const chartData = data.atendimento_risco || [];
    const grouped = {};
    chartData.forEach(row => {
        grouped[row.Classificacao] = (grouped[row.Classificacao] || 0) + parseInt(row.Quantidade || 0);
    });

    const canvas = document.getElementById('chartRisco');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.risco) charts.risco.destroy();

    const colors = ['#ff6b6b', '#ff9900', '#ffd700', '#00aa66', '#0066cc'];

    charts.risco = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(grouped),
            datasets: [{
                data: Object.values(grouped),
                backgroundColor: colors,
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold' },
                    formatter: (value, ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return percentage + '%';
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderChartSexo(data) {
    const chartData = data.atendimento_sexo || [];
    const grouped = {};
    chartData.forEach(row => {
        grouped[row.Sexo] = (grouped[row.Sexo] || 0) + parseInt(row.Quantidade || 0);
    });

    const canvas = document.getElementById('chartSexo');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.sexo) charts.sexo.destroy();

    charts.sexo = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: Object.keys(grouped),
            datasets: [{
                label: 'Quantidade',
                data: Object.values(grouped),
                backgroundColor: ['#0066cc', '#ff6b6b', '#999'],
                borderColor: '#fff',
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

function renderChartMunicipio(data) {
    const chartData = data.atendimento_municipio || [];
    const grouped = {};
    chartData.forEach(row => {
        grouped[row.Municipio] = (grouped[row.Municipio] || 0) + parseInt(row.Quantidade || 0);
    });

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 10);

    const canvas = document.getElementById('chartMunicipio');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.municipio) charts.municipio.destroy();

    charts.municipio = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(([k]) => k),
            datasets: [{
                label: 'Atendimentos',
                data: sorted.map(([, v]) => v),
                backgroundColor: '#0066cc',
                borderColor: '#004499',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });
}

function renderTableCID(data) {
    const chartData = data.atendimento_cid || [];
    const tbody = document.querySelector('#tableCID tbody');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    const sorted = chartData.sort((a, b) => parseInt(b.Quantidade || 0) - parseInt(a.Quantidade || 0)).slice(0, 50);

    sorted.forEach((row, index) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${index + 1}</td>
            <td>${row.CID_Full}</td>
            <td>${formatMes(row.Mes)}</td>
            <td class="text-right"><strong>${parseInt(row.Quantidade || 0).toLocaleString('pt-BR')}</strong></td>
        `;
        tbody.appendChild(tr);
    });
}

// ===== ABA ASSISTENCIAL =====
function renderAssistencial() {
    const data = getFilteredData();
    
    renderKPIAssistencial(data);
    renderChartOxigenio(data);
    renderTableLab(data);
    renderTableRadiografia(data);
    renderTableProcedimentos(data);
}

function renderKPIAssistencial(data) {
    const container = document.getElementById('kpiAssistencial');
    if (!container) return;
    container.innerHTML = '';

    const totalOxy = (data.logistica_oxigenio || []).reduce((sum, row) => sum + parseFloat(row.M3 || 0), 0);
    const totalLab = (data.exames_laboratoriais || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const totalRad = (data.radiografias || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const totalProc = (data.procedimentos || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);

    const kpis = [
        { title: 'Consumo Oxigênio (M³)', value: totalOxy.toFixed(0), class: 'primary' },
        { title: 'Exames Laboratoriais', value: totalLab, class: 'secondary' },
        { title: 'Radiografias', value: totalRad, class: 'warning' },
        { title: 'Procedimentos', value: totalProc, class: 'primary' }
    ];

    kpis.forEach(kpi => {
        const card = document.createElement('div');
        card.className = `kpi-card ${kpi.class}`;
        card.innerHTML = `<h3>${kpi.title}</h3><div class="value">${kpi.value.toLocaleString('pt-BR')}</div>`;
        container.appendChild(card);
    });
}

function renderChartOxigenio(data) {
    const chartData = data.logistica_oxigenio || [];
    const grouped = {};
    chartData.forEach(row => {
        grouped[row.Tipo] = (grouped[row.Tipo] || 0) + parseFloat(row.M3 || 0);
    });

    const canvas = document.getElementById('chartOxigenio');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.oxigenio) charts.oxigenio.destroy();

    charts.oxigenio = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(grouped),
            datasets: [{
                data: Object.values(grouped),
                backgroundColor: ['#0066cc', '#00aa66', '#ff9900'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold' },
                    formatter: (value) => value.toFixed(0) + ' M³'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderTableLab(data) {
    const chartData = data.exames_laboratoriais || [];
    const grouped = {};
    chartData.forEach(row => {
        const examCode = row.Exame.split(' - ')[1]?.trim() || row.Exame;
        grouped[examCode] = (grouped[examCode] || 0) + parseInt(row.Quantidade || 0);
    });

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 15);

    const container = document.getElementById('tableLabContainer');
    if (!container) return;

    let html = '<h3>🔬 Top 15 Exames Laboratoriais</h3>';
    html += '<table><thead><tr><th>Ranking</th><th>Exame</th><th>Quantidade</th></tr></thead><tbody>';

    sorted.forEach((item, index) => {
        html += `<tr><td><strong>${index + 1}</strong></td><td>${item[0]}</td><td class="text-right"><strong>${item[1].toLocaleString('pt-BR')}</strong></td></tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderTableRadiografia(data) {
    const chartData = data.radiografias || [];
    const grouped = {};
    chartData.forEach(row => {
        const examCode = row.Exame.split(' - ')[1]?.trim() || row.Exame;
        grouped[examCode] = (grouped[examCode] || 0) + parseInt(row.Quantidade || 0);
    });

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 15);

    const container = document.getElementById('tableRadiografiaContainer');
    if (!container) return;

    let html = '<h3>🖼️ Top 15 Radiografias</h3>';
    html += '<table><thead><tr><th>Ranking</th><th>Radiografia</th><th>Quantidade</th></tr></thead><tbody>';

    sorted.forEach((item, index) => {
        html += `<tr><td><strong>${index + 1}</strong></td><td>${item[0]}</td><td class="text-right"><strong>${item[1].toLocaleString('pt-BR')}</strong></td></tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

function renderTableProcedimentos(data) {
    const chartData = data.procedimentos || [];
    const grouped = {};
    chartData.forEach(row => {
        const procCode = row.Procedimento.split(' - ')[1]?.trim() || row.Procedimento;
        grouped[procCode] = (grouped[procCode] || 0) + parseInt(row.Quantidade || 0);
    });

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]).slice(0, 15);

    const container = document.getElementById('tableProcedimentosContainer');
    if (!container) return;

    let html = '<h3>⚕️ Top 15 Procedimentos</h3>';
    html += '<table><thead><tr><th>Ranking</th><th>Procedimento</th><th>Quantidade</th></tr></thead><tbody>';

    sorted.forEach((item, index) => {
        html += `<tr><td><strong>${index + 1}</strong></td><td>${item[0]}</td><td class="text-right"><strong>${item[1].toLocaleString('pt-BR')}</strong></td></tr>`;
    });

    html += '</tbody></table>';
    container.innerHTML = html;
}

// ===== ABA OPERACIONAL =====
function renderOperacional() {
    const data = getFilteredData();
    
    renderKPIOperacional(data);
    renderChartInternacaoTipo(data);
    renderChartTransporte(data);
    renderChartResiduos(data);
    renderChartLavanderia(data);
}

function renderKPIOperacional(data) {
    const container = document.getElementById('kpiOperacional');
    if (!container) return;
    container.innerHTML = '';

    const totalInternacoes = (data.internacoes_tipo || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const totalAtendimentos = (data.atendimento_geral_mensal || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const taxaOcupacao = totalAtendimentos > 0 ? ((totalInternacoes / totalAtendimentos) * 100).toFixed(2) : 0;
    
    const totalResiduos = (data.logistica_residuos || []).reduce((sum, row) => sum + parseFloat(row.KG || 0), 0);
    const totalLavanderia = (data.logistica_lavanderia || []).reduce((sum, row) => sum + parseFloat(row.Peso || 0), 0);
    const totalTransporte = (data.logistica_transporte || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);

    const kpis = [
        { title: 'Total Internações', value: totalInternacoes, class: 'primary' },
        { title: 'Taxa de Ocupação', value: taxaOcupacao + '%', class: 'warning' },
        { title: 'Resíduos (KG)', value: totalResiduos.toFixed(0), class: 'secondary' },
        { title: 'Lavanderia (KG)', value: totalLavanderia.toFixed(0), class: 'primary' },
        { title: 'Remoções', value: totalTransporte, class: 'secondary' }
    ];

    kpis.forEach(kpi => {
        const card = document.createElement('div');
        card.className = `kpi-card ${kpi.class}`;
        card.innerHTML = `<h3>${kpi.title}</h3><div class="value">${kpi.value.toLocaleString('pt-BR')}</div>`;
        container.appendChild(card);
    });
}

function renderChartInternacaoTipo(data) {
    const chartData = data.internacoes_tipo || [];
    const grouped = {};
    chartData.forEach(row => {
        grouped[row.Tipo] = (grouped[row.Tipo] || 0) + parseInt(row.Quantidade || 0);
    });

    const canvas = document.getElementById('chartInternacaoTipo');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.internacaoTipo) charts.internacaoTipo.destroy();

    charts.internacaoTipo = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(grouped),
            datasets: [{
                data: Object.values(grouped),
                backgroundColor: ['#0066cc', '#00aa66'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold' },
                    formatter: (value, ctx) => {
                        const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return percentage + '%';
                    }
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderChartTransporte(data) {
    const chartData = data.logistica_transporte || [];
    const grouped = {};
    chartData.forEach(row => {
        grouped[row.Destino] = (grouped[row.Destino] || 0) + parseInt(row.Quantidade || 0);
    });

    const sorted = Object.entries(grouped).sort((a, b) => b[1] - a[1]);

    const canvas = document.getElementById('chartTransporte');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.transporte) charts.transporte.destroy();

    charts.transporte = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sorted.map(([k]) => k),
            datasets: [{
                label: 'Remoções',
                data: sorted.map(([, v]) => v),
                backgroundColor: '#0066cc',
                borderColor: '#004499',
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: false } },
            scales: { x: { beginAtZero: true } }
        }
    });
}

function renderChartResiduos(data) {
    const chartData = data.logistica_residuos || [];
    const grouped = {};
    chartData.forEach(row => {
        grouped[row.Grupo] = (grouped[row.Grupo] || 0) + parseFloat(row.KG || 0);
    });

    const canvas = document.getElementById('chartResiduos');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.residuos) charts.residuos.destroy();

    charts.residuos = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: Object.keys(grouped),
            datasets: [{
                data: Object.values(grouped),
                backgroundColor: ['#ff6b6b', '#ff9900', '#ffd700'],
                borderColor: '#fff',
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { position: 'bottom' },
                datalabels: {
                    color: '#fff',
                    font: { weight: 'bold' },
                    formatter: (value) => value.toFixed(0) + ' KG'
                }
            }
        },
        plugins: [ChartDataLabels]
    });
}

function renderChartLavanderia(data) {
    const chartData = data.logistica_lavanderia || [];
    const sorted = chartData.sort((a, b) => a.Mes.localeCompare(b.Mes));

    const canvas = document.getElementById('chartLavanderia');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    if (charts.lavanderia) charts.lavanderia.destroy();

    charts.lavanderia = new Chart(ctx, {
        type: 'line',
        data: {
            labels: sorted.map(row => formatMes(row.Mes)),
            datasets: [{
                label: 'Peso (KG)',
                data: sorted.map(row => parseFloat(row.Peso || 0)),
                borderColor: '#0066cc',
                backgroundColor: 'rgba(0, 102, 204, 0.1)',
                tension: 0.4,
                fill: true,
                pointRadius: 5,
                pointBackgroundColor: '#0066cc'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: { legend: { display: true } },
            scales: { y: { beginAtZero: true } }
        }
    });
}

// ===== ABA INSIGHTS =====
function renderInsights() {
    const data = getFilteredData();
    
    const container = document.getElementById('insightsContent');
    if (!container) return;
    
    const totalAtend = (data.atendimento_geral_mensal || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const totalIntern = (data.internacoes_tipo || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);
    const taxaOcupacao = totalAtend > 0 ? ((totalIntern / totalAtend) * 100).toFixed(2) : 0;
    
    const riscosData = {};
    (data.atendimento_risco || []).forEach(row => {
        riscosData[row.Classificacao] = (riscosData[row.Classificacao] || 0) + parseInt(row.Quantidade || 0);
    });

    const sexoData = {};
    (data.atendimento_sexo || []).forEach(row => {
        sexoData[row.Sexo] = (sexoData[row.Sexo] || 0) + parseInt(row.Quantidade || 0);
    });

    const municipioData = {};
    (data.atendimento_municipio || []).forEach(row => {
        municipioData[row.Municipio] = (municipioData[row.Municipio] || 0) + parseInt(row.Quantidade || 0);
    });

    const topMunicipios = Object.entries(municipioData).sort((a, b) => b[1] - a[1]).slice(0, 5);

    const totalOxy = (data.logistica_oxigenio || []).reduce((sum, row) => sum + parseFloat(row.M3 || 0), 0);
    const totalResiduos = (data.logistica_residuos || []).reduce((sum, row) => sum + parseFloat(row.KG || 0), 0);
    const totalLavanderia = (data.logistica_lavanderia || []).reduce((sum, row) => sum + parseFloat(row.Peso || 0), 0);
    const totalTransporte = (data.logistica_transporte || []).reduce((sum, row) => sum + parseInt(row.Quantidade || 0), 0);

    let html = `
        <div class="metrics-grid">
            <div class="metric-card">
                <h4>📊 VOLUME DE ATENDIMENTOS</h4>
                <table class="metrics-table">
                    <tr><td>Total de Atendimentos:</td><td><strong>${totalAtend.toLocaleString('pt-BR')}</strong></td></tr>
                    <tr><td>Total de Internações:</td><td><strong>${totalIntern.toLocaleString('pt-BR')}</strong></td></tr>
                    <tr><td>Taxa de Ocupação:</td><td><strong>${taxaOcupacao}%</strong></td></tr>
                </table>
            </div>

            <div class="metric-card">
                <h4>⚠️ CLASSIFICAÇÃO DE RISCO</h4>
                <table class="metrics-table">
                    ${Object.entries(riscosData).map(([k, v]) => `<tr><td>${k}:</td><td><strong>${v.toLocaleString('pt-BR')}</strong> (${((v/totalAtend)*100).toFixed(1)}%)</td></tr>`).join('')}
                </table>
            </div>

            <div class="metric-card">
                <h4>👥 DISTRIBUIÇÃO POR SEXO</h4>
                <table class="metrics-table">
                    ${Object.entries(sexoData).map(([k, v]) => `<tr><td>${k}:</td><td><strong>${v.toLocaleString('pt-BR')}</strong> (${((v/totalAtend)*100).toFixed(1)}%)</td></tr>`).join('')}
                </table>
            </div>

            <div class="metric-card">
                <h4>📍 TOP 5 MUNICÍPIOS</h4>
                <table class="metrics-table">
                    ${topMunicipios.map(([k, v]) => `<tr><td>${k}:</td><td><strong>${v.toLocaleString('pt-BR')}</strong> (${((v/totalAtend)*100).toFixed(1)}%)</td></tr>`).join('')}
                </table>
            </div>

            <div class="metric-card">
                <h4>💨 CONSUMO DE OXIGÊNIO</h4>
                <table class="metrics-table">
                    <tr><td>Total (M³):</td><td><strong>${totalOxy.toFixed(0).toLocaleString('pt-BR')}</strong></td></tr>
                    <tr><td>Por Atendimento:</td><td><strong>${(totalOxy / totalAtend).toFixed(2)}</strong> M³</td></tr>
                </table>
            </div>

            <div class="metric-card">
                <h4>♻️ GESTÃO DE RESÍDUOS</h4>
                <table class="metrics-table">
                    <tr><td>Total (KG):</td><td><strong>${totalResiduos.toFixed(0).toLocaleString('pt-BR')}</strong></td></tr>
                    <tr><td>Por Atendimento:</td><td><strong>${(totalResiduos / totalAtend).toFixed(2)}</strong> KG</td></tr>
                </table>
            </div>

            <div class="metric-card">
                <h4>🧺 OPERAÇÕES LAVANDERIA</h4>
                <table class="metrics-table">
                    <tr><td>Total (KG):</td><td><strong>${totalLavanderia.toFixed(0).toLocaleString('pt-BR')}</strong></td></tr>
                    <tr><td>Por Internação:</td><td><strong>${(totalLavanderia / totalIntern).toFixed(2)}</strong> KG</td></tr>
                </table>
            </div>

            <div class="metric-card">
                <h4>🚑 REMOÇÕES</h4>
                <table class="metrics-table">
                    <tr><td>Total de Remoções:</td><td><strong>${totalTransporte.toLocaleString('pt-BR')}</strong></td></tr>
                    <tr><td>% de Internações:</td><td><strong>${((totalTransporte / totalIntern) * 100).toFixed(1)}%</strong></td></tr>
                </table>
            </div>
        </div>
    `;

    container.innerHTML = html;
}

// ===== FUNÇÕES DE NAVEGAÇÃO =====
function showTab(tabName) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.tab-button').forEach(btn => btn.classList.remove('active'));
    
    const tabElement = document.getElementById(tabName);
    if (tabElement) {
        tabElement.classList.add('active');
    }
    
    event.target.classList.add('active');

    if (tabName === 'executivo') renderExecutivo();
    else if (tabName === 'atendimento') renderAtendimento();
    else if (tabName === 'assistencial') renderAssistencial();
    else if (tabName === 'operacional') renderOperacional();
    else if (tabName === 'insights') renderInsights();
}
