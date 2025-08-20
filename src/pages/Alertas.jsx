import { useState, useEffect } from 'react';
import { AlertTriangle, Thermometer, Droplets, Weight, Clock, Trash2 } from 'lucide-react';

const Alertas = ({ silos = [] }) => {
  const [dismissedAlerts, setDismissedAlerts] = useState(new Set());

  // Função para gerar alertas baseados nos dados dos silos (mesma lógica do modal)
  const generateAlerts = () => {
    const alerts = [];
    const now = new Date();

    silos.forEach(silo => {
      // Alerta de capacidade
      if (silo.capacity >= 90) {
        const alertId = `capacity-${silo.id}`;
        if (!dismissedAlerts.has(alertId)) {
          alerts.push({
            id: alertId,
            siloId: silo.id,
            siloName: silo.name,
            type: 'capacity',
            severity: 'high',
            title: 'Capacidade Crítica',
            description: `${silo.name} está com ${silo.capacity}% de capacidade. Remoção urgente recomendada.`,
            value: `${silo.capacity}%`,
            icon: Weight,
            timestamp: new Date(now - Math.random() * 3600000), // Último 1 hora
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          });
        }
      } else if (silo.capacity >= 75) {
        const alertId = `capacity-${silo.id}`;
        if (!dismissedAlerts.has(alertId)) {
          alerts.push({
            id: alertId,
            siloId: silo.id,
            siloName: silo.name,
            type: 'capacity',
            severity: 'medium',
            title: 'Capacidade Alta',
            description: `${silo.name} está com ${silo.capacity}% de capacidade. Considere programar remoção.`,
            value: `${silo.capacity}%`,
            icon: Weight,
            timestamp: new Date(now - Math.random() * 7200000), // Últimas 2 horas
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
          });
        }
      }

      // Alerta de temperatura
      if (silo.temperature >= 30) {
        const alertId = `temperature-${silo.id}`;
        if (!dismissedAlerts.has(alertId)) {
          alerts.push({
            id: alertId,
            siloId: silo.id,
            siloName: silo.name,
            type: 'temperature',
            severity: 'high',
            title: 'Temperatura Crítica',
            description: `${silo.name} apresenta temperatura de ${silo.temperature}°C. Verificação imediata necessária.`,
            value: `${silo.temperature}°C`,
            icon: Thermometer,
            timestamp: new Date(now - Math.random() * 1800000), // Últimos 30 min
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          });
        }
      } else if (silo.temperature >= 27) {
        const alertId = `temperature-${silo.id}`;
        if (!dismissedAlerts.has(alertId)) {
          alerts.push({
            id: alertId,
            siloId: silo.id,
            siloName: silo.name,
            type: 'temperature',
            severity: 'medium',
            title: 'Temperatura Elevada',
            description: `${silo.name} apresenta temperatura de ${silo.temperature}°C. Monitoramento recomendado.`,
            value: `${silo.temperature}°C`,
            icon: Thermometer,
            timestamp: new Date(now - Math.random() * 3600000), // Última 1 hora
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
          });
        }
      }

      // Alerta de umidade
      if (silo.humidity >= 70) {
        const alertId = `humidity-${silo.id}`;
        if (!dismissedAlerts.has(alertId)) {
          alerts.push({
            id: alertId,
            siloId: silo.id,
            siloName: silo.name,
            type: 'humidity',
            severity: 'high',
            title: 'Umidade Crítica',
            description: `${silo.name} apresenta umidade de ${silo.humidity}%. Risco de deterioração do produto.`,
            value: `${silo.humidity}%`,
            icon: Droplets,
            timestamp: new Date(now - Math.random() * 2700000), // Últimos 45 min
            color: 'text-red-600',
            bgColor: 'bg-red-50',
            borderColor: 'border-red-200'
          });
        }
      } else if (silo.humidity >= 65) {
        const alertId = `humidity-${silo.id}`;
        if (!dismissedAlerts.has(alertId)) {
          alerts.push({
            id: alertId,
            siloId: silo.id,
            siloName: silo.name,
            type: 'humidity',
            severity: 'medium',
            title: 'Umidade Elevada',
            description: `${silo.name} apresenta umidade de ${silo.humidity}%. Verificar sistema de ventilação.`,
            value: `${silo.humidity}%`,
            icon: Droplets,
            timestamp: new Date(now - Math.random() * 5400000), // Últimas 1.5 horas
            color: 'text-yellow-600',
            bgColor: 'bg-yellow-50',
            borderColor: 'border-yellow-200'
          });
        }
      }
    });

    // Ordenar por severidade (high primeiro) e depois por timestamp (mais recente primeiro)
    return alerts.sort((a, b) => {
      if (a.severity !== b.severity) {
        return a.severity === 'high' ? -1 : 1;
      }
      return new Date(b.timestamp) - new Date(a.timestamp);
    });
  };

  const alerts = generateAlerts();

  const formatTimestamp = (timestamp) => {
    const now = new Date();
    const diff = now - timestamp;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);

    if (minutes < 1) return 'Agora mesmo';
    if (minutes < 60) return `Há ${minutes} min`;
    if (hours < 24) return `Há ${hours}h`;
    return timestamp.toLocaleDateString('pt-BR', { 
      day: '2-digit', 
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getSeverityBadge = (severity) => {
    if (severity === 'high') {
      return (
        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800">
          <AlertTriangle className="w-3 h-3 mr-1" />
          Crítico
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
        <AlertTriangle className="w-3 h-3 mr-1" />
        Atenção
      </span>
    );
  };

  const dismissAlert = (alertId) => {
    setDismissedAlerts(prev => new Set([...prev, alertId]));
  };

  const clearAllAlerts = () => {
    const allAlertIds = alerts.map(alert => alert.id);
    setDismissedAlerts(prev => new Set([...prev, ...allAlertIds]));
  };

  return (
    <div className="main-content">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">
            Notificações
            {alerts.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
                {alerts.length}
              </span>
            )}
          </h2>
          {alerts.length > 0 && (
            <button 
              onClick={clearAllAlerts}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700 transition-colors"
            >
              <Trash2 size={16} />
              <span className="text-sm">Limpar todas</span>
            </button>
          )}
        </div>

        {alerts.length === 0 ? (
          <div className="text-center py-12">
            <AlertTriangle className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Nenhum alerta ativo
            </h3>
            <p className="text-gray-500">
              Todos os silos estão operando dentro dos parâmetros normais.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert) => {
              const IconComponent = alert.icon;
              return (
                <div
                  key={alert.id}
                  className={`p-4 rounded-lg border-l-4 ${alert.bgColor} ${alert.borderColor} relative`}
                >
                  <button
                    onClick={() => dismissAlert(alert.id)}
                    className="absolute top-2 right-2 p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-white hover:bg-opacity-50 transition-colors"
                    title="Dispensar alerta"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                  
                  <div className="flex items-start space-x-3 pr-8">
                    <div className={`flex-shrink-0 ${alert.color}`}>
                      <IconComponent className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <h4 className="text-sm font-medium text-gray-900">
                          {alert.title}
                        </h4>
                        {getSeverityBadge(alert.severity)}
                      </div>
                      <p className="text-sm text-gray-700 mb-2">
                        {alert.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className={`text-sm font-semibold ${alert.color}`}>
                          Valor atual: {alert.value}
                        </span>
                        <div className="flex items-center text-xs text-gray-500">
                          <Clock className="h-3 w-3 mr-1" />
                          {formatTimestamp(alert.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {alerts.length > 0 && (
          <div className="mt-6 text-center">
            <button 
              onClick={clearAllAlerts}
              className="bg-red-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-600 transition-colors flex items-center space-x-2 mx-auto"
            >
              <Trash2 size={20} />
              <span>Limpar todas as notificações</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Alertas;

