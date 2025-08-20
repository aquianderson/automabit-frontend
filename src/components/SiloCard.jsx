import { Thermometer, Droplets, Weight, Wifi, Trash2 } from 'lucide-react';

const SiloCard = ({ silo, onClick, onDelete }) => {
  const getProgressClass = (percentage) => {
    if (percentage >= 85) return 'danger';
    if (percentage >= 70) return 'warning';
    return 'normal';
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Normal': return 'text-green-600';
      case 'Atenção': return 'text-yellow-600';
      case 'Alerta': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div 
      className="silo-card cursor-pointer hover:shadow-md transition-shadow duration-200" 
      onClick={() => onClick(silo)}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-semibold text-lg">{silo.name}</h3>
          <p className="text-sm text-gray-600">{silo.product} - {silo.location}</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(silo);
            }}
            className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Remover silo"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <Wifi className="h-3 w-3 text-green-500 animate-pulse" title="Dados em tempo real" />
          <span className={`text-sm font-medium ${getStatusColor(silo.status)}`}>
            {silo.status}
          </span>
        </div>
      </div>

      <div className="mb-3">
        <div className="flex justify-between items-center mb-1">
          <span className="text-sm text-gray-600">Capacidade</span>
          <span className="text-sm font-medium">{silo.capacity}%</span>
        </div>
        <div className="progress-bar">
          <div 
            className={`progress-fill ${getProgressClass(silo.capacity)}`}
            style={{ width: `${silo.capacity}%` }}
          ></div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <div className="flex items-center space-x-2">
          <Thermometer size={16} className="text-red-500" />
          <div>
            <p className="text-xs text-gray-600">Temp</p>
            <p className="text-sm font-medium">{silo.temperature}°C</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Droplets size={16} className="text-blue-500" />
          <div>
            <p className="text-xs text-gray-600">Umidade</p>
            <p className="text-sm font-medium">{silo.humidity}%</p>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Weight size={16} className="text-gray-500" />
          <div>
            <p className="text-xs text-gray-600">Peso</p>
            <p className="text-sm font-medium">{silo.weight}t</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SiloCard;

