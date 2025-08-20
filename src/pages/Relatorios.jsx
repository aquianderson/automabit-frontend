import { useState } from 'react';
import { FileText, Download, Calendar, CheckSquare, Square } from 'lucide-react';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

const Relatorios = () => {
  const [activeTab, setActiveTab] = useState('disponiveis');
  const [selectedSilos, setSelectedSilos] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState('');
  const [selectedInfoTypes, setSelectedInfoTypes] = useState([]);
  const [isGenerating, setIsGenerating] = useState(false);

  // Dados mockados para os relatórios
  const mockSilosData = [
    {
      name: 'Silo 1 - Milho',
      product: 'Milho',
      location: 'Armazém - Setor 08/10',
      capacity: 85,
      temperature: 25,
      humidity: 60,
      weight: 45,
      status: 'Alerta',
      alerts: [
        { date: '2025-08-19', time: '14:30', message: 'Capacidade crítica atingida', type: 'Alerta' },
        { date: '2025-08-18', time: '10:15', message: 'Temperatura alta', type: 'Atenção' }
      ]
    },
    {
      name: 'Silo 2 - Soja',
      product: 'Soja',
      location: 'Armazém - Setor 04/10',
      capacity: 72,
      temperature: 22,
      humidity: 55,
      weight: 38,
      status: 'Normal',
      alerts: []
    },
    {
      name: 'Silo 3 - Trigo',
      product: 'Trigo',
      location: 'Armazém - Setor 06/10',
      capacity: 45,
      temperature: 20,
      humidity: 50,
      weight: 28,
      status: 'Normal',
      alerts: []
    }
  ];

  // Função wrapper para adicionar feedback visual
  const handleGeneratePDF = async (generateFunction, reportName) => {
    setIsGenerating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500)); // Simular processamento
      generateFunction();
      // Feedback visual de sucesso
      const originalText = document.activeElement?.textContent;
      if (document.activeElement) {
        document.activeElement.innerHTML = '<span>✓ PDF Gerado!</span>';
        setTimeout(() => {
          if (document.activeElement) {
            document.activeElement.innerHTML = originalText;
          }
        }, 2000);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar o relatório. Tente novamente.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Função para gerar PDF - Resumo Mensal
  const generateMonthlyReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    // Cabeçalho
    doc.setFontSize(20);
    doc.text('AUTOMABIT - Relatório Mensal', 20, 25);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${currentDate}`, 20, 35);
    
    // Resumo Geral
    doc.setFontSize(16);
    doc.text('Resumo Geral', 20, 55);
    doc.setFontSize(12);
    
    const totalSilos = mockSilosData.length;
    const capacidadeMedia = Math.round(mockSilosData.reduce((acc, silo) => acc + silo.capacity, 0) / totalSilos);
    const silosComAlerta = mockSilosData.filter(silo => silo.status !== 'Normal').length;
    
    doc.text(`Total de Silos: ${totalSilos}`, 20, 70);
    doc.text(`Capacidade Média: ${capacidadeMedia}%`, 20, 80);
    doc.text(`Silos com Alertas: ${silosComAlerta}`, 20, 90);
    
    // Tabela de Silos
    const tableData = mockSilosData.map(silo => [
      silo.name,
      silo.product,
      `${silo.capacity}%`,
      `${silo.temperature}°C`,
      `${silo.humidity}%`,
      `${silo.weight}t`,
      silo.status
    ]);
    
    doc.autoTable({
      head: [['Silo', 'Produto', 'Capacidade', 'Temp.', 'Umidade', 'Peso', 'Status']],
      body: tableData,
      startY: 105,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save('relatorio-mensal-automabit.pdf');
  };

  // Função para gerar PDF - Movimentações
  const generateMovementReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    doc.setFontSize(20);
    doc.text('AUTOMABIT - Relatório de Movimentações', 20, 25);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${currentDate}`, 20, 35);
    
    doc.setFontSize(16);
    doc.text('Movimentações por Silo', 20, 55);
    
    // Dados mockados de movimentações
    const movementData = [
      ['Silo 1 - Milho', '15/08/2025', 'Entrada', '12.5t', 'Recebimento de carga'],
      ['Silo 1 - Milho', '17/08/2025', 'Saída', '8.2t', 'Expedição para cliente'],
      ['Silo 2 - Soja', '16/08/2025', 'Entrada', '15.0t', 'Recebimento de carga'],
      ['Silo 3 - Trigo', '18/08/2025', 'Entrada', '10.3t', 'Recebimento de carga'],
      ['Silo 2 - Soja', '19/08/2025', 'Saída', '5.5t', 'Expedição para cliente']
    ];
    
    doc.autoTable({
      head: [['Silo', 'Data', 'Tipo', 'Quantidade', 'Observações']],
      body: movementData,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [34, 197, 94] }
    });
    
    doc.save('relatorio-movimentacoes-automabit.pdf');
  };

  // Função para gerar PDF - Histórico de Alertas
  const generateAlertsReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    doc.setFontSize(20);
    doc.text('AUTOMABIT - Histórico de Alertas', 20, 25);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${currentDate}`, 20, 35);
    
    doc.setFontSize(16);
    doc.text('Alertas Registrados', 20, 55);
    
    const alertsData = [];
    mockSilosData.forEach(silo => {
      silo.alerts.forEach(alert => {
        alertsData.push([
          silo.name,
          alert.date,
          alert.time,
          alert.type,
          alert.message
        ]);
      });
    });
    
    if (alertsData.length === 0) {
      doc.setFontSize(12);
      doc.text('Nenhum alerta registrado no período.', 20, 70);
    } else {
      doc.autoTable({
        head: [['Silo', 'Data', 'Hora', 'Tipo', 'Descrição']],
        body: alertsData,
        startY: 70,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [245, 158, 11] }
      });
    }
    
    doc.save('relatorio-alertas-automabit.pdf');
  };

  // Função para gerar PDF - Análise de Qualidade
  const generateQualityReport = () => {
    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    doc.setFontSize(20);
    doc.text('AUTOMABIT - Análise de Qualidade', 20, 25);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${currentDate}`, 20, 35);
    
    doc.setFontSize(16);
    doc.text('Parâmetros de Qualidade', 20, 55);
    
    const qualityData = mockSilosData.map(silo => [
      silo.name,
      silo.product,
      `${silo.temperature}°C`,
      `${silo.humidity}%`,
      silo.temperature > 28 ? 'Atenção' : 'Normal',
      silo.humidity > 65 ? 'Atenção' : 'Normal'
    ]);
    
    doc.autoTable({
      head: [['Silo', 'Produto', 'Temperatura', 'Umidade', 'Status Temp.', 'Status Umid.']],
      body: qualityData,
      startY: 70,
      styles: { fontSize: 10 },
      headStyles: { fillColor: [147, 51, 234] }
    });
    
    // Adicionar recomendações
    doc.setFontSize(14);
    doc.text('Recomendações:', 20, doc.autoTable.previous.finalY + 20);
    doc.setFontSize(10);
    doc.text('• Manter temperatura entre 18°C e 28°C', 20, doc.autoTable.previous.finalY + 35);
    doc.text('• Manter umidade entre 45% e 65%', 20, doc.autoTable.previous.finalY + 45);
    doc.text('• Verificar ventilação em caso de parâmetros fora da faixa', 20, doc.autoTable.previous.finalY + 55);
    
    doc.save('relatorio-qualidade-automabit.pdf');
  };

  // Função para gerar relatório personalizado
  const generateCustomReport = () => {
    if (selectedSilos.length === 0 || !selectedPeriod || selectedInfoTypes.length === 0) {
      alert('Por favor, selecione pelo menos um silo, um período e um tipo de informação.');
      return;
    }

    const doc = new jsPDF();
    const currentDate = new Date().toLocaleDateString('pt-BR');
    
    doc.setFontSize(20);
    doc.text('AUTOMABIT - Relatório Personalizado', 20, 25);
    doc.setFontSize(12);
    doc.text(`Gerado em: ${currentDate}`, 20, 35);
    doc.text(`Período: ${selectedPeriod}`, 20, 45);
    
    doc.setFontSize(14);
    doc.text('Silos Selecionados:', 20, 65);
    doc.setFontSize(10);
    selectedSilos.forEach((silo, index) => {
      doc.text(`• ${silo}`, 25, 75 + (index * 8));
    });
    
    doc.setFontSize(14);
    doc.text('Tipos de Informação:', 20, 85 + (selectedSilos.length * 8));
    doc.setFontSize(10);
    selectedInfoTypes.forEach((type, index) => {
      doc.text(`• ${type}`, 25, 95 + (selectedSilos.length * 8) + (index * 8));
    });
    
    // Filtrar dados baseado na seleção
    const filteredData = mockSilosData
      .filter(silo => selectedSilos.some(selected => silo.name.includes(selected)))
      .map(silo => {
        const row = [silo.name];
        if (selectedInfoTypes.includes('Temperatura')) row.push(`${silo.temperature}°C`);
        if (selectedInfoTypes.includes('Umidade')) row.push(`${silo.humidity}%`);
        if (selectedInfoTypes.includes('Movimentações')) row.push(`${silo.weight}t`);
        if (selectedInfoTypes.includes('Alertas')) row.push(silo.alerts.length);
        return row;
      });
    
    const headers = ['Silo'];
    if (selectedInfoTypes.includes('Temperatura')) headers.push('Temp.');
    if (selectedInfoTypes.includes('Umidade')) headers.push('Umidade');
    if (selectedInfoTypes.includes('Movimentações')) headers.push('Peso');
    if (selectedInfoTypes.includes('Alertas')) headers.push('Alertas');
    
    doc.autoTable({
      head: [headers],
      body: filteredData,
      startY: 115 + (selectedSilos.length * 8) + (selectedInfoTypes.length * 8),
      styles: { fontSize: 10 },
      headStyles: { fillColor: [59, 130, 246] }
    });
    
    doc.save('relatorio-personalizado-automabit.pdf');
  };

  const relatoriosDisponiveis = [
    {
      id: 1,
      title: 'Resumo Mensal',
      description: 'Visão geral de todos os silos no mês',
      icon: FileText,
      color: 'bg-blue-50 text-blue-600',
      generatePDF: () => handleGeneratePDF(generateMonthlyReport, 'Resumo Mensal')
    },
    {
      id: 2,
      title: 'Movimentações',
      description: 'Entradas e saídas por período',
      icon: FileText,
      color: 'bg-green-50 text-green-600',
      generatePDF: () => handleGeneratePDF(generateMovementReport, 'Movimentações')
    },
    {
      id: 3,
      title: 'Histórico de Alertas',
      description: 'Alertas registrados por silo',
      icon: FileText,
      color: 'bg-yellow-50 text-yellow-600',
      generatePDF: () => handleGeneratePDF(generateAlertsReport, 'Histórico de Alertas')
    },
    {
      id: 4,
      title: 'Análise de Qualidade',
      description: 'Temperatura e umidade ao longo do tempo',
      icon: FileText,
      color: 'bg-purple-50 text-purple-600',
      generatePDF: () => handleGeneratePDF(generateQualityReport, 'Análise de Qualidade')
    }
  ];

  const silosOptions = ['Silo 1', 'Silo 2', 'Silo 3'];
  const infoTypes = ['Movimentações', 'Temperatura', 'Umidade', 'Alertas'];

  const toggleSilo = (silo) => {
    setSelectedSilos(prev => 
      prev.includes(silo) 
        ? prev.filter(s => s !== silo)
        : [...prev, silo]
    );
  };

  const toggleInfoType = (type) => {
    setSelectedInfoTypes(prev => 
      prev.includes(type) 
        ? prev.filter(t => t !== type)
        : [...prev, type]
    );
  };

  const generateReport = () => {
    handleGeneratePDF(generateCustomReport, 'Relatório Personalizado');
  };

  return (
    <div className="main-content">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Relatórios</h2>
        
        {/* Tabs */}
        <div className="flex space-x-1 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setActiveTab('disponiveis')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'disponiveis' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Relatórios Disponíveis
          </button>
          <button
            onClick={() => setActiveTab('personalizado')}
            className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
              activeTab === 'personalizado' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Relatório Personalizado
          </button>
        </div>

        {/* Conteúdo das tabs */}
        {activeTab === 'disponiveis' ? (
          <div className="space-y-4">
            {relatoriosDisponiveis.map(relatorio => {
              const Icon = relatorio.icon;
              return (
                <div key={relatorio.id} className="bg-white rounded-lg p-4 shadow-sm border">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${relatorio.color}`}>
                        <Icon size={20} />
                      </div>
                      <div>
                        <h3 className="font-semibold">{relatorio.title}</h3>
                        <p className="text-sm text-gray-600">{relatorio.description}</p>
                      </div>
                    </div>
                    <button 
                      onClick={relatorio.generatePDF}
                      disabled={isGenerating}
                      className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center space-x-2 ${
                        isGenerating 
                          ? 'bg-gray-400 text-white cursor-not-allowed' 
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                    >
                      <Download size={16} />
                      <span>{isGenerating ? 'Gerando...' : 'Gerar PDF'}</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="bg-white rounded-lg p-6 shadow-sm border">
            <h3 className="text-lg font-semibold mb-4">Relatório Personalizado</h3>
            
            {/* Seleção de Silos */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Selecione os silos:</h4>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedSilos(selectedSilos.length === silosOptions.length ? [] : [...silosOptions])}
                  className="text-blue-600 text-sm hover:text-blue-700 transition-colors"
                >
                  {selectedSilos.length === silosOptions.length ? 'Desmarcar todos' : 'Todos os Silos'}
                </button>
                {silosOptions.map(silo => (
                  <div key={silo} className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleSilo(silo)}
                      className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded transition-colors"
                    >
                      {selectedSilos.includes(silo) ? (
                        <CheckSquare size={16} className="text-blue-600" />
                      ) : (
                        <Square size={16} className="text-gray-400" />
                      )}
                      <span className="text-sm">{silo}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Seleção de Período */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Selecione o período:</h4>
              <div className="grid grid-cols-2 gap-2">
                {['Últimos 30 dias', 'Últimos 7 dias', 'Último mês', 'Último ano'].map(period => (
                  <button
                    key={period}
                    onClick={() => setSelectedPeriod(period)}
                    className={`p-2 text-sm rounded-lg border transition-colors ${
                      selectedPeriod === period
                        ? 'border-blue-500 bg-blue-50 text-blue-600'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </div>

            {/* Tipo de Informação */}
            <div className="mb-6">
              <h4 className="font-medium mb-3">Tipo de Informação:</h4>
              <div className="space-y-2">
                {infoTypes.map(type => (
                  <div key={type} className="flex items-center space-x-2">
                    <button
                      onClick={() => toggleInfoType(type)}
                      className="flex items-center space-x-2 hover:bg-gray-50 p-1 rounded transition-colors"
                    >
                      {selectedInfoTypes.includes(type) ? (
                        <CheckSquare size={16} className="text-blue-600" />
                      ) : (
                        <Square size={16} className="text-gray-400" />
                      )}
                      <span className="text-sm">{type}</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Botão Gerar Relatório */}
            <button 
              onClick={generateReport}
              disabled={isGenerating}
              className={`w-full py-3 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2 ${
                isGenerating 
                  ? 'bg-gray-400 text-white cursor-not-allowed' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              <Download size={20} />
              <span>{isGenerating ? 'Gerando Relatório...' : 'Gerar Relatório'}</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Relatorios;

