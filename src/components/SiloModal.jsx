import { Thermometer, Droplets, Weight, MapPin, Package, Calendar, Clock, AlertTriangle, Wifi } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const SiloModal = ({ silo, isOpen, onClose }) => {
  if (!silo) return null;

  const getProgressClass = (percentage) => {
    if (percentage >= 85) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'text-green-600 bg-green-50';
      case 'Atenção': return 'text-yellow-600 bg-yellow-50';
      case 'Alerta': return 'text-red-600 bg-red-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const mockDetailedData = {
    lastUpdate: new Date().toLocaleString('pt-BR'),
    installationDate: '2023-03-15',
    maxCapacity: '50 toneladas',
    currentWeight: silo.weight,
    sensors: {
      temperature: { min: 18, max: 30, current: silo.temperature },
      humidity: { min: 45, max: 65, current: silo.humidity },
      weight: { min: 0, max: 50, current: silo.weight }
    },
    alerts: silo.status !== 'Normal' ? [
      {
        type: silo.status,
        message: silo.status === 'Alerta' ? 'Capacidade crítica atingida' : 'Monitoramento necessário',
        time: new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      }
    ] : []
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Package className="h-5 w-5" />
            {silo.name}
            <Wifi className="h-4 w-4 text-green-500 ml-auto animate-pulse" title="Dados em tempo real" />
          </DialogTitle>
          <DialogDescription className="text-sm">
            Informações detalhadas do silo • Atualizado em tempo real
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto flex-1">

        <div className="space-y-4 sm:space-y-6">
          {/* Status */}
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status:</span>
            <span className={`px-2 py-1 sm:px-3 rounded-full text-xs sm:text-sm font-medium ${getStatusColor(silo.status)}`}>
              {silo.status}
            </span>
          </div>

          {/* Localização e Produto */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Localização</p>
                <p className="text-xs sm:text-sm text-gray-600 break-words">{silo.location}</p>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Package className="h-4 w-4 text-gray-500 mt-0.5" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">Produto</p>
                <p className="text-xs sm:text-sm text-gray-600">{silo.product}</p>
              </div>
            </div>
          </div>

          {/* Capacidade */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-sm font-medium">Capacidade</span>
              <span className="text-sm font-bold">{silo.capacity}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2 sm:h-3">
              <div 
                className={`h-2 sm:h-3 rounded-full transition-all duration-300 ${getProgressClass(silo.capacity)}`}
                style={{ width: `${silo.capacity}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>0%</span>
              <span>50%</span>
              <span>100%</span>
            </div>
          </div>

          {/* Métricas */}
          <div className="grid grid-cols-1 gap-3 sm:gap-4">
            <div className="p-3 sm:p-4 bg-red-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Thermometer className="h-4 w-4 text-red-500" />
                <span className="text-sm font-medium">Temperatura</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-red-600">{silo.temperature}°C</div>
              <div className="text-xs text-gray-500">
                Faixa: {mockDetailedData.sensors.temperature.min}°C - {mockDetailedData.sensors.temperature.max}°C
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-blue-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Droplets className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">Umidade</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-blue-600">{silo.humidity}%</div>
              <div className="text-xs text-gray-500">
                Faixa: {mockDetailedData.sensors.humidity.min}% - {mockDetailedData.sensors.humidity.max}%
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <Weight className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Peso</span>
              </div>
              <div className="text-xl sm:text-2xl font-bold text-gray-600">{silo.weight}t</div>
              <div className="text-xs text-gray-500">
                Capacidade máxima: {mockDetailedData.maxCapacity}
              </div>
            </div>
          </div>

          {/* Alertas */}
          {mockDetailedData.alerts.length > 0 && (
            <div className="p-3 sm:p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">Alertas Ativos</span>
              </div>
              {mockDetailedData.alerts.map((alert, index) => (
                <div key={index} className="text-sm text-yellow-700">
                  <div className="font-medium">{alert.message}</div>
                  <div className="text-xs">Às {alert.time}</div>
                </div>
              ))}
            </div>
          )}

          {/* Informações Adicionais */}
          <div className="space-y-2 text-sm border-t pt-3 sm:pt-4">
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">Última atualização:</span>
              <span className="font-medium text-xs sm:text-sm text-right">{mockDetailedData.lastUpdate}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <span className="text-gray-600 text-xs sm:text-sm">Data de instalação:</span>
              <span className="font-medium text-xs sm:text-sm">{mockDetailedData.installationDate}</span>
            </div>
          </div>
        </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SiloModal;
