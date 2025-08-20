import { X, Thermometer, Droplets, AlertTriangle } from 'lucide-react';

const AlertCard = ({ alert, onDismiss }) => {
  const getAlertIcon = (type) => {
    switch (type) {
      case 'temperature':
        return <Thermometer size={20} className="text-red-500" />;
      case 'humidity':
        return <Droplets size={20} className="text-blue-500" />;
      case 'capacity':
        return <AlertTriangle size={20} className="text-yellow-500" />;
      default:
        return <AlertTriangle size={20} className="text-gray-500" />;
    }
  };

  return (
    <div className={`alert-card ${alert.type}`}>
      <div className="flex justify-between items-start">
        <div className="flex items-start space-x-3">
          {getAlertIcon(alert.type)}
          <div>
            <h4 className="font-semibold text-sm">{alert.title}</h4>
            <p className="text-sm text-gray-600 mt-1">{alert.description}</p>
            <p className="text-xs text-gray-500 mt-2">{alert.time}</p>
          </div>
        </div>
        {onDismiss && (
          <button
            onClick={() => onDismiss(alert.id)}
            className="p-1 hover:bg-gray-200 rounded-full transition-colors"
          >
            <X size={16} />
          </button>
        )}
      </div>
    </div>
  );
};

export default AlertCard;

