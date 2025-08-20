import React, { useState, useEffect } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  TrendingDown, 
  Thermometer, 
  Droplets, 
  Gauge, 
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Target,
  Database,
  Zap
} from 'lucide-react';

const Dashboard = ({ silos = [] }) => {
  const [selectedMetric, setSelectedMetric] = useState('temperature');
  const [timeRange, setTimeRange] = useState('24h');
  const [historicalData, setHistoricalData] = useState([]);

  // Gerar dados históricos simulados
  useEffect(() => {
    const generateHistoricalData = () => {
      const data = [];
      const hours = timeRange === '24h' ? 24 : timeRange === '7d' ? 168 : 720;
      const now = new Date();
      
      for (let i = hours; i >= 0; i--) {
        const time = new Date(now.getTime() - i * 60 * 60 * 1000);
        const dataPoint = {
          time: time.toISOString(),
          temperature: 22 + Math.sin(i * 0.1) * 3 + Math.random() * 2,
          humidity: 45 + Math.cos(i * 0.15) * 8 + Math.random() * 3,
          capacity: Math.min(95, 30 + (i * 0.05) + Math.random() * 5)
        };
        data.push(dataPoint);
      }
      return data;
    };

    setHistoricalData(generateHistoricalData());
  }, [timeRange]);

  // Calcular métricas
  const metrics = {
    totalSilos: silos.length,
    activeSilos: silos.filter(s => s.conectado !== false).length,
    avgTemperature: silos.length > 0 ? 
      (silos.reduce((sum, s) => sum + (s.temperature || 0), 0) / silos.length).toFixed(1) : '0',
    avgHumidity: silos.length > 0 ? 
      (silos.reduce((sum, s) => sum + (s.humidity || 0), 0) / silos.length).toFixed(1) : '0',
    avgCapacity: silos.length > 0 ? 
      (silos.reduce((sum, s) => sum + (s.capacity || 0), 0) / silos.length).toFixed(1) : '0',
    efficiency: silos.length > 0 ? 
      ((silos.filter(s => s.conectado !== false).length / silos.length) * 100).toFixed(1) : '0',
    totalGrains: silos.reduce((sum, s) => {
      const capacity = s.capacity || 0;
      const maxCapacity = 1000; // toneladas por silo
      return sum + (capacity / 100 * maxCapacity);
    }, 0).toFixed(0)
  };

  // Status dos silos
  const siloStatus = {
    normal: silos.filter(s => 
      (s.temperature || 0) < 27 && 
      (s.humidity || 0) < 65 && 
      (s.capacity || 0) < 75 && 
      s.conectado !== false
    ).length,
    warning: silos.filter(s => 
      ((s.temperature || 0) >= 27 && (s.temperature || 0) < 30) ||
      ((s.humidity || 0) >= 65 && (s.humidity || 0) < 70) ||
      ((s.capacity || 0) >= 75 && (s.capacity || 0) < 90)
    ).length,
    critical: silos.filter(s => 
      (s.temperature || 0) >= 30 || 
      (s.humidity || 0) >= 70 || 
      (s.capacity || 0) >= 90
    ).length,
    offline: silos.filter(s => s.conectado === false).length
  };

  // Criar dados para gráfico
  const chartData = historicalData.slice(-20).map((data, index) => ({
    index,
    value: parseFloat(data[selectedMetric]).toFixed(1),
    time: new Date(data.time).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }));

  // Insights automáticos
  const generateInsights = () => {
    const insights = [];
    
    if (siloStatus.critical > 0) {
      insights.push({
        type: 'critical',
        title: 'Atenção Crítica',
        message: `${siloStatus.critical} silo(s) em estado crítico. Ação imediata necessária.`
      });
    }
    
    if (parseFloat(metrics.avgCapacity) > 80) {
      insights.push({
        type: 'warning',
        title: 'Capacidade Alta',
        message: `Capacidade média dos silos está em ${metrics.avgCapacity}%. Considere o esvaziamento.`
      });
    }
    
    if (parseFloat(metrics.efficiency) < 90) {
      insights.push({
        type: 'warning',
        title: 'Eficiência Reduzida',
        message: `Eficiência do sistema está em ${metrics.efficiency}%. Verifique conexões.`
      });
    }
    
    if (insights.length === 0) {
      insights.push({
        type: 'success',
        title: 'Sistema Operacional',
        message: 'Todos os silos estão funcionando dentro dos parâmetros normais.'
      });
    }
    
    return insights;
  };

  const insights = generateInsights();

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <BarChart3 className="w-8 h-8 text-blue-600" />
              Dashboard Analytics
            </h1>
            <p className="text-gray-600 mt-1">Monitoramento em tempo real dos seus silos</p>
          </div>
          <div className="flex gap-2">
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="24h">Últimas 24h</option>
              <option value="7d">Últimos 7 dias</option>
              <option value="30d">Últimos 30 dias</option>
            </select>
          </div>
        </div>
      </div>

      {/* Métricas Principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Temperatura Média</p>
              <p className="text-2xl font-bold text-orange-600">{metrics.avgTemperature}°C</p>
              <p className="text-xs text-gray-500 mt-1">Últimas 24h</p>
            </div>
            <Thermometer className="w-8 h-8 text-orange-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Umidade Média</p>
              <p className="text-2xl font-bold text-blue-600">{metrics.avgHumidity}%</p>
              <p className="text-xs text-gray-500 mt-1">Últimas 24h</p>
            </div>
            <Droplets className="w-8 h-8 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Capacidade Média</p>
              <p className="text-2xl font-bold text-green-600">{metrics.avgCapacity}%</p>
              <p className="text-xs text-gray-500 mt-1">Total dos silos</p>
            </div>
            <Gauge className="w-8 h-8 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Eficiência</p>
              <p className="text-2xl font-bold text-purple-600">{metrics.efficiency}%</p>
              <p className="text-xs text-gray-500 mt-1">Silos online</p>
            </div>
            <Zap className="w-8 h-8 text-purple-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total de Grãos</p>
              <p className="text-2xl font-bold text-yellow-600">{metrics.totalGrains}t</p>
              <p className="text-xs text-gray-500 mt-1">Armazenados</p>
            </div>
            <Database className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Gráfico de Tendências e Status */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Tendências */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Tendências</h3>
            <select
              value={selectedMetric}
              onChange={(e) => setSelectedMetric(e.target.value)}
              className="px-3 py-1 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500"
            >
              <option value="temperature">Temperatura</option>
              <option value="humidity">Umidade</option>
              <option value="capacity">Capacidade</option>
            </select>
          </div>
          
          <div className="h-64 relative">
            <svg className="w-full h-full" viewBox="0 0 400 200">
              {/* Grid */}
              <defs>
                <pattern id="grid" width="40" height="20" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 20" fill="none" stroke="#f1f5f9" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
              
              {/* Linha do gráfico */}
              {chartData.length > 1 && (
                <polyline
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  points={chartData.map((point, index) => {
                    const x = (index / (chartData.length - 1)) * 380 + 10;
                    const maxValue = selectedMetric === 'temperature' ? 35 : 
                                   selectedMetric === 'humidity' ? 100 : 100;
                    const y = 180 - (point.value / maxValue) * 160;
                    return `${x},${y}`;
                  }).join(' ')}
                />
              )}
              
              {/* Pontos */}
              {chartData.map((point, index) => {
                const x = (index / (chartData.length - 1)) * 380 + 10;
                const maxValue = selectedMetric === 'temperature' ? 35 : 
                               selectedMetric === 'humidity' ? 100 : 100;
                const y = 180 - (point.value / maxValue) * 160;
                return (
                  <circle
                    key={index}
                    cx={x}
                    cy={y}
                    r="3"
                    fill="#3b82f6"
                  />
                );
              })}
            </svg>
          </div>
          
          <div className="flex justify-between text-xs text-gray-500 mt-2">
            <span>{chartData[0]?.time}</span>
            <span>{chartData[chartData.length - 1]?.time}</span>
          </div>
        </div>

        {/* Status dos Silos */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Status dos Silos</h3>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">Normal</p>
                  <p className="text-sm text-green-700">Funcionando corretamente</p>
                </div>
              </div>
              <span className="text-xl font-bold text-green-600">{siloStatus.normal}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-600" />
                <div>
                  <p className="font-medium text-yellow-900">Atenção</p>
                  <p className="text-sm text-yellow-700">Monitoramento necessário</p>
                </div>
              </div>
              <span className="text-xl font-bold text-yellow-600">{siloStatus.warning}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-600" />
                <div>
                  <p className="font-medium text-red-900">Crítico</p>
                  <p className="text-sm text-red-700">Ação imediata necessária</p>
                </div>
              </div>
              <span className="text-xl font-bold text-red-600">{siloStatus.critical}</span>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <Activity className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-900">Offline</p>
                  <p className="text-sm text-gray-700">Sem conexão</p>
                </div>
              </div>
              <span className="text-xl font-bold text-gray-600">{siloStatus.offline}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Insights Automáticos */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-600" />
          Insights e Recomendações
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {insights.map((insight, index) => (
            <div 
              key={index}
              className={`p-4 rounded-lg border-l-4 ${
                insight.type === 'critical' ? 'bg-red-50 border-red-500' :
                insight.type === 'warning' ? 'bg-yellow-50 border-yellow-500' :
                'bg-green-50 border-green-500'
              }`}
            >
              <h4 className={`font-semibold ${
                insight.type === 'critical' ? 'text-red-900' :
                insight.type === 'warning' ? 'text-yellow-900' :
                'text-green-900'
              }`}>
                {insight.title}
              </h4>
              <p className={`text-sm mt-1 ${
                insight.type === 'critical' ? 'text-red-700' :
                insight.type === 'warning' ? 'text-yellow-700' :
                'text-green-700'
              }`}>
                {insight.message}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Lista Detalhada dos Silos */}
      {silos.length > 0 && (
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Monitoramento Individual</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Silo</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Temperatura</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Umidade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Capacidade</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-700">Grãos</th>
                </tr>
              </thead>
              <tbody>
                {silos.map((silo) => {
                  const status = silo.conectado === false ? 'offline' :
                                (silo.temperature >= 30 || silo.humidity >= 70 || silo.capacity >= 90) ? 'critical' :
                                (silo.temperature >= 27 || silo.humidity >= 65 || silo.capacity >= 75) ? 'warning' :
                                'normal';
                  
                  return (
                    <tr key={silo.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div>
                          <p className="font-medium text-gray-900">{silo.name}</p>
                          <p className="text-sm text-gray-500">{silo.graos}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          status === 'offline' ? 'bg-gray-100 text-gray-800' :
                          status === 'critical' ? 'bg-red-100 text-red-800' :
                          status === 'warning' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {status === 'offline' ? 'Offline' :
                           status === 'critical' ? 'Crítico' :
                           status === 'warning' ? 'Atenção' :
                           'Normal'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          (silo.temperature || 0) >= 30 ? 'text-red-600' :
                          (silo.temperature || 0) >= 27 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {(silo.temperature || 0).toFixed(1)}°C
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`font-medium ${
                          (silo.humidity || 0) >= 70 ? 'text-red-600' :
                          (silo.humidity || 0) >= 65 ? 'text-yellow-600' :
                          'text-green-600'
                        }`}>
                          {(silo.humidity || 0).toFixed(1)}%
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <span className={`font-medium ${
                            (silo.capacity || 0) >= 90 ? 'text-red-600' :
                            (silo.capacity || 0) >= 75 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {(silo.capacity || 0).toFixed(1)}%
                          </span>
                          <div className="w-16 bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full ${
                                (silo.capacity || 0) >= 90 ? 'bg-red-500' :
                                (silo.capacity || 0) >= 75 ? 'bg-yellow-500' :
                                'bg-green-500'
                              }`}
                              style={{ width: `${Math.min(100, silo.capacity || 0)}%` }}
                            ></div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-gray-600">
                          {((silo.capacity || 0) / 100 * 1000).toFixed(0)}t
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
