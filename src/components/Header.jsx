import { useState } from 'react';
import { Bell, User, BarChart3 } from 'lucide-react';
import ProfileModal from './ProfileModal';
import AlertsModal from './AlertsModal';

const Header = ({ onLogout, silos = [] }) => {
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isAlertsModalOpen, setIsAlertsModalOpen] = useState(false);

  // Calcular estatísticas dos silos
  const totalSilos = silos.length;
  const connectedSilos = silos.filter(silo => silo.conectado !== false).length;
  const criticalSilos = silos.filter(silo => 
    silo.temperature > 30 || silo.humidity > 70 || silo.capacity > 90
  ).length;
  
  // Calcular número de alertas ativos
  const alertsCount = silos.filter(silo => 
    silo.status === 'Alerta' || silo.status === 'Atenção'
  ).length;

  const handleProfileClick = () => {
    setIsProfileModalOpen(true);
  };

  const handleCloseProfileModal = () => {
    setIsProfileModalOpen(false);
  };

  const handleAlertsClick = () => {
    setIsAlertsModalOpen(true);
  };

  const handleCloseAlertsModal = () => {
    setIsAlertsModalOpen(false);
  };

  return (
    <>
      <header className="automabit-header">
        <div className="flex items-center space-x-6">
          <h1 className="text-xl font-bold">AutomaBit</h1>
          
          {/* Estatísticas do Sistema - Desktop */}
          {totalSilos > 0 && (
            <div className="header-stats">
              <div className="stat-item" title="Total de silos cadastrados">
                <BarChart3 size={16} />
                <span>{totalSilos} Silo{totalSilos > 1 ? 's' : ''}</span>
              </div>
              <div className="stat-item" title={`${connectedSilos} de ${totalSilos} silos conectados`}>
                <div className={`status-indicator ${connectedSilos === totalSilos ? 'online' : 'partial'}`}></div>
                <span>{connectedSilos}/{totalSilos} Online</span>
              </div>
              {criticalSilos > 0 && (
                <div className="stat-item" title={`${criticalSilos} silo${criticalSilos > 1 ? 's' : ''} com alertas críticos`} style={{ color: '#fca5a5' }}>
                  <div className="status-indicator critical"></div>
                  <span>{criticalSilos} Crítico{criticalSilos > 1 ? 's' : ''}</span>
                </div>
              )}
            </div>
          )}

          {/* Estatísticas Compactas - Mobile */}
          {totalSilos > 0 && (
            <div className="header-stats-mobile">
              <div className="stat-item-mobile" title={`${totalSilos} silos, ${connectedSilos} online${criticalSilos > 0 ? `, ${criticalSilos} críticos` : ''}`}>
                <BarChart3 size={14} />
                <span>{totalSilos}</span>
                {criticalSilos > 0 && <div className="status-indicator critical" style={{ width: '6px', height: '6px' }}></div>}
              </div>
            </div>
          )}
        </div>
        <div className="flex items-center space-x-4">
          <button 
            onClick={handleAlertsClick}
            className="relative p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Alertas do Sistema"
          >
            <Bell size={20} />
            {alertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-medium">
                {alertsCount > 9 ? '9+' : alertsCount}
              </span>
            )}
          </button>
          <button 
            onClick={handleProfileClick}
            className="p-2 hover:bg-blue-600 rounded-full transition-colors"
            title="Perfil da Fazenda"
          >
            <User size={20} />
          </button>
        </div>
      </header>

      <ProfileModal 
        isOpen={isProfileModalOpen}
        onClose={handleCloseProfileModal}
        onLogout={onLogout}
      />

      <AlertsModal
        isOpen={isAlertsModalOpen}
        onClose={handleCloseAlertsModal}
        silos={silos}
      />
    </>
  );
};

export default Header;

