import { ChevronDown, Download } from 'lucide-react';
import { useState } from 'react';

const Historico = () => {
  const [filtroSilo, setFiltroSilo] = useState('todos');
  const [filtroPeriodo, setFiltroPeriodo] = useState('hoje');

  // Dados mockados para demonstração
  const movimentacoes = [
    {
      id: 1,
      tipo: 'Entrada',
      silo: 'Silo 1',
      data: '15/01/2024',
      hora: '14:30',
      quantidade: '+25 ton',
      responsavel: 'João Silva',
      status: 'entrada'
    },
    {
      id: 2,
      tipo: 'Saída',
      silo: 'Silo 2',
      data: '15/01/2024',
      hora: '10:15',
      quantidade: '-15 ton',
      responsavel: 'Maria Santos',
      status: 'saida'
    },
    {
      id: 3,
      tipo: 'Entrada',
      silo: 'Silo 1',
      data: '14/01/2024',
      hora: '16:45',
      quantidade: '+40 ton',
      responsavel: 'Pedro Costa',
      status: 'entrada'
    },
    {
      id: 4,
      tipo: 'Saída',
      silo: 'Silo 3',
      data: '14/01/2024',
      hora: '09:30',
      quantidade: '-30 ton',
      responsavel: 'Ana Lima',
      status: 'saida'
    },
    {
      id: 5,
      tipo: 'Entrada',
      silo: 'Silo 3',
      data: '13/01/2024',
      hora: '11:20',
      quantidade: '+35 ton',
      responsavel: 'Carlos Pereira',
      status: 'entrada'
    }
  ];

  return (
    <div className="main-content">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Histórico de Movimentações</h2>
        
        {/* Filtros */}
        <div className="flex space-x-4 mb-4">
          <div className="relative">
            <select 
              value={filtroSilo}
              onChange={(e) => setFiltroSilo(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="todos">Todos os silos</option>
              <option value="silo1">Silo 1</option>
              <option value="silo2">Silo 2</option>
              <option value="silo3">Silo 3</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 top-3 text-gray-400" />
          </div>
          
          <div className="relative">
            <select 
              value={filtroPeriodo}
              onChange={(e) => setFiltroPeriodo(e.target.value)}
              className="appearance-none bg-white border border-gray-300 rounded-lg px-4 py-2 pr-8 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="hoje">Hoje</option>
              <option value="semana">Última semana</option>
              <option value="mes">Último mês</option>
              <option value="ano">Último ano</option>
            </select>
            <ChevronDown size={16} className="absolute right-2 top-3 text-gray-400" />
          </div>
        </div>

        {/* Lista de movimentações */}
        <div className="space-y-3">
          {movimentacoes.map(mov => (
            <div key={mov.id} className="bg-white rounded-lg p-4 shadow-sm border">
              <div className="flex justify-between items-start">
                <div className="flex items-start space-x-3">
                  <div className={`w-3 h-3 rounded-full mt-2 ${
                    mov.status === 'entrada' ? 'bg-green-500' : 'bg-red-500'
                  }`}></div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <span className={`font-semibold ${
                        mov.status === 'entrada' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {mov.tipo}
                      </span>
                      <span className="text-gray-500">-</span>
                      <span className="font-medium">{mov.silo}</span>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      {mov.data} às {mov.hora}
                    </p>
                    <p className="text-sm text-gray-600">
                      Responsável: {mov.responsavel}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className={`font-bold ${
                    mov.status === 'entrada' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {mov.quantidade}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Botão Exportar Relatório */}
        <div className="mt-6 text-center">
          <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-600 transition-colors flex items-center space-x-2 mx-auto">
            <Download size={20} />
            <span>Exportar Relatório</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Historico;

