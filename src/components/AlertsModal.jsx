import { AlertTriangle, Thermometer, Droplets, Weight, Clock } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const AlertsModal = ({ isOpen, onClose, silos }) => {
  // Função para gerar alertas baseados nos dados dos silos
  const generateAlerts = () => {
    const alerts = [];
    const now = new Date();

    silos.forEach(silo => {
      // Alerta de capacidade
      if (silo.capacity >= 90) {
        alerts.push({
          id: `capacity-${silo.id}`,
          siloId: silo.id,
          siloName: silo.name,
          type: 'capacity',
          severity: 'high',
          title: 'Capacidade Crítica',
          message: `Silo com ${silo.capacity}% de capacidade`,
          value: `${silo.capacity}%`,
          icon: Weight,
          timestamp: new Date(now - Math.random() * 3600000), // Último 1 hora
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        });
      } else if (silo.capacity >= 75) {
        alerts.push({
          id: `capacity-${silo.id}`,
          siloId: silo.id,
          siloName: silo.name,
          type: 'capacity',
          severity: 'medium',
          title: 'Capacidade Alta',
          message: `Silo com ${silo.capacity}% de capacidade`,
          value: `${silo.capacity}%`,
          icon: Weight,
          timestamp: new Date(now - Math.random() * 7200000), // Últimas 2 horas
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        });
      }

      // Alerta de temperatura
      if (silo.temperature >= 30) {
        alerts.push({
          id: `temperature-${silo.id}`,
          siloId: silo.id,
          siloName: silo.name,
          type: 'temperature',
          severity: 'high',
          title: 'Temperatura Crítica',
          message: `Temperatura de ${silo.temperature}°C detectada`,
          value: `${silo.temperature}°C`,
          icon: Thermometer,
          timestamp: new Date(now - Math.random() * 1800000), // Últimos 30 min
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        });
      } else if (silo.temperature >= 27) {
        alerts.push({
          id: `temperature-${silo.id}`,
          siloId: silo.id,
          siloName: silo.name,
          type: 'temperature',
          severity: 'medium',
          title: 'Temperatura Elevada',
          message: `Temperatura de ${silo.temperature}°C detectada`,
          value: `${silo.temperature}°C`,
          icon: Thermometer,
          timestamp: new Date(now - Math.random() * 3600000), // Última 1 hora
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        });
      }

      // Alerta de umidade
      if (silo.humidity >= 70) {
        alerts.push({
          id: `humidity-${silo.id}`,
          siloId: silo.id,
          siloName: silo.name,
          type: 'humidity',
          severity: 'high',
          title: 'Umidade Crítica',
          message: `Umidade de ${silo.humidity}% detectada`,
          value: `${silo.humidity}%`,
          icon: Droplets,
          timestamp: new Date(now - Math.random() * 2700000), // Últimos 45 min
          color: 'text-red-600',
          bgColor: 'bg-red-50',
          borderColor: 'border-red-200'
        });
      } else if (silo.humidity >= 65) {
        alerts.push({
          id: `humidity-${silo.id}`,
          siloId: silo.id,
          siloName: silo.name,
          type: 'humidity',
          severity: 'medium',
          title: 'Umidade Elevada',
          message: `Umidade de ${silo.humidity}% detectada`,
          value: `${silo.humidity}%`,
          icon: Droplets,
          timestamp: new Date(now - Math.random() * 5400000), // Últimas 1.5 horas
          color: 'text-yellow-600',
          bgColor: 'bg-yellow-50',
          borderColor: 'border-yellow-200'
        });
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
    if (minutes < 60) return `${minutes} min atrás`;
    if (hours < 24) return `${hours}h atrás`;
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Alertas do Sistema
            {alerts.length > 0 && (
              <span className="ml-2 bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded-full">
                {alerts.length}
              </span>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto flex-1">
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
                    className={`p-4 rounded-lg border-l-4 ${alert.bgColor} ${alert.borderColor}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className={`flex-shrink-0 ${alert.color}`}>
                          <IconComponent className="h-5 w-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-medium text-gray-900">
                              {alert.title}
                            </h4>
                            {getSeverityBadge(alert.severity)}
                          </div>
                          <p className="text-sm text-gray-700 mb-1">
                            <strong>{alert.siloName}:</strong> {alert.message}
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
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AlertsModal;
