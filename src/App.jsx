import { useState, useEffect } from 'react';
import Header from './components/Header';
import BottomNavigation from './components/BottomNavigation';
import Login from './components/Login';
import ForgotPassword from './components/ForgotPassword';
import ContactUs from './components/ContactUs';
import Toast from './components/Toast';
import ToastContainer from './components/ToastContainer';
import Inicio from './pages/Inicio';
import Dashboard from './pages/Dashboard';
import Historico from './pages/Historico';
import Alertas from './pages/Alertas';
import Relatorios from './pages/Relatorios';
import useToast from './hooks/useToast';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('inicio');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showWelcomeToast, setShowWelcomeToast] = useState(false);
  const [showLogoutToast, setShowLogoutToast] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [showContactUs, setShowContactUs] = useState(false);
  const [userName, setUserName] = useState('');
  const [silos, setSilos] = useState([]);
  const [lastAlerts, setLastAlerts] = useState({}); // Para controlar alertas repetidos
  
  // Hook do sistema de toasts
  const {
    toasts,
    removeToast,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCritical
  } = useToast();

  // Verificar se o usuário já está logado ao carregar a página
  useEffect(() => {
    const checkAuth = () => {
      const user = localStorage.getItem('automabit_user');
      if (user) {
        try {
          const userData = JSON.parse(user);
          // Verificar se o login não expirou (24 horas)
          const loginTime = new Date(userData.loginTime);
          const now = new Date();
          const hoursDiff = (now - loginTime) / (1000 * 60 * 60);
          
          if (hoursDiff < 24) {
            setIsAuthenticated(true);
            setUserName(userData.name || 'Usuário');
          } else {
            // Login expirado, remover dados
            localStorage.removeItem('automabit_user');
          }
        } catch (error) {
          // Dados corrompidos, remover
          localStorage.removeItem('automabit_user');
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    const user = localStorage.getItem('automabit_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setUserName(userData.name || 'Usuário');
      } catch (error) {
        setUserName('Usuário');
      }
    }
    setIsAuthenticated(true);
    setShowWelcomeToast(true);
    setShowLogoutToast(false); // Reset logout toast when logging in
  };

  const handleForgotPassword = () => {
    setShowForgotPassword(true);
  };

  const handleBackToLogin = () => {
    setShowForgotPassword(false);
    setShowContactUs(false);
  };

  const handleContactUs = () => {
    setShowContactUs(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('automabit_user');
    setIsAuthenticated(false);
    setActiveTab('inicio');
    setUserName('');
    setShowWelcomeToast(false);
    setShowLogoutToast(true);
  };

  // Função para lidar com atualizações dos silos e verificar alertas
  const handleSilosUpdate = (updatedSilos) => {
    const previousSilos = silos;
    setSilos(updatedSilos);
    
    // Só verificar alertas se há silos anteriores (para evitar alertas na inicialização)
    if (previousSilos.length === 0) return;
    
    // Verificar alertas críticos apenas se não foram mostrados recentemente
    const currentTime = Date.now();
    const ALERT_COOLDOWN = 5 * 60 * 1000; // 5 minutos de cooldown entre alertas similares
    
    updatedSilos.forEach(silo => {
      const siloKey = `silo_${silo.id}`;
      const lastAlert = lastAlerts[siloKey] || {};
      
      // Encontrar silo anterior para comparação
      const previousSilo = previousSilos.find(s => s.id === silo.id);
      if (!previousSilo) return;
      
      // Alertas de temperatura (só se o valor mudou significativamente)
      if (silo.temperature >= 30 && Math.abs(silo.temperature - previousSilo.temperature) >= 0.5) {
        if (!lastAlert.temp_critical || (currentTime - lastAlert.temp_critical) > ALERT_COOLDOWN) {
          showCritical(
            'Temperatura Crítica!',
            `${silo.name}: ${silo.temperature}°C - Ação imediata necessária`
          );
          setLastAlerts(prev => ({
            ...prev,
            [siloKey]: { ...prev[siloKey], temp_critical: currentTime }
          }));
        }
      } else if (silo.temperature >= 27 && silo.temperature < 30 && Math.abs(silo.temperature - previousSilo.temperature) >= 0.5) {
        if (!lastAlert.temp_warning || (currentTime - lastAlert.temp_warning) > ALERT_COOLDOWN) {
          showWarning(
            'Temperatura Elevada',
            `${silo.name}: ${silo.temperature}°C - Monitorar de perto`
          );
          setLastAlerts(prev => ({
            ...prev,
            [siloKey]: { ...prev[siloKey], temp_warning: currentTime }
          }));
        }
      }
      
      // Alertas de umidade (só se o valor mudou significativamente)
      if (silo.humidity >= 70 && Math.abs(silo.humidity - previousSilo.humidity) >= 1) {
        if (!lastAlert.humidity_critical || (currentTime - lastAlert.humidity_critical) > ALERT_COOLDOWN) {
          showCritical(
            'Umidade Crítica!',
            `${silo.name}: ${silo.humidity}% - Risco de deterioração`
          );
          setLastAlerts(prev => ({
            ...prev,
            [siloKey]: { ...prev[siloKey], humidity_critical: currentTime }
          }));
        }
      } else if (silo.humidity >= 65 && silo.humidity < 70 && Math.abs(silo.humidity - previousSilo.humidity) >= 1) {
        if (!lastAlert.humidity_warning || (currentTime - lastAlert.humidity_warning) > ALERT_COOLDOWN) {
          showWarning(
            'Umidade Alta',
            `${silo.name}: ${silo.humidity}% - Verificar ventilação`
          );
          setLastAlerts(prev => ({
            ...prev,
            [siloKey]: { ...prev[siloKey], humidity_warning: currentTime }
          }));
        }
      }
      
      // Alertas de capacidade (só se o valor mudou significativamente)
      if (silo.capacity >= 90 && Math.abs(silo.capacity - previousSilo.capacity) >= 0.5) {
        if (!lastAlert.capacity_critical || (currentTime - lastAlert.capacity_critical) > ALERT_COOLDOWN) {
          showCritical(
            'Capacidade Crítica!',
            `${silo.name}: ${silo.capacity}% - Esvaziar urgentemente`
          );
          setLastAlerts(prev => ({
            ...prev,
            [siloKey]: { ...prev[siloKey], capacity_critical: currentTime }
          }));
        }
      } else if (silo.capacity >= 75 && silo.capacity < 90 && Math.abs(silo.capacity - previousSilo.capacity) >= 0.5) {
        if (!lastAlert.capacity_warning || (currentTime - lastAlert.capacity_warning) > ALERT_COOLDOWN) {
          showWarning(
            'Capacidade Alta',
            `${silo.name}: ${silo.capacity}% - Planejar esvaziamento`
          );
          setLastAlerts(prev => ({
            ...prev,
            [siloKey]: { ...prev[siloKey], capacity_warning: currentTime }
          }));
        }
      }
      
      // Alerta de desconexão (só se mudou de conectado para desconectado)
      if (silo.conectado === false && previousSilo.conectado !== false) {
        if (!lastAlert.disconnected || (currentTime - lastAlert.disconnected) > ALERT_COOLDOWN) {
          showError(
            'Perda de Conexão',
            `${silo.name} está desconectado - Verificar equipamento`
          );
          setLastAlerts(prev => ({
            ...prev,
            [siloKey]: { ...prev[siloKey], disconnected: currentTime }
          }));
        }
      }
    });
  };

  // Tela de carregamento
  if (isLoading) {
    return (
      <div className="min-h-screen bg-blue-600 flex items-center justify-center">
        <div className="text-center text-white">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold">AutomaBit</h1>
          <p className="text-blue-200">Carregando...</p>
        </div>
      </div>
    );
  }

  // Se não estiver autenticado, mostrar tela de login, esqueceu senha ou contato
  if (!isAuthenticated) {
    if (showContactUs) {
      return (
        <>
          <ContactUs onBackToLogin={handleBackToLogin} />
          <Toast
            message="Logout realizado com sucesso!"
            type="info"
            isVisible={showLogoutToast}
            onClose={() => setShowLogoutToast(false)}
            duration={3000}
          />
        </>
      );
    }

    if (showForgotPassword) {
      return (
        <>
          <ForgotPassword onBackToLogin={handleBackToLogin} />
          <Toast
            message="Logout realizado com sucesso!"
            type="info"
            isVisible={showLogoutToast}
            onClose={() => setShowLogoutToast(false)}
            duration={3000}
          />
        </>
      );
    }

    return (
      <>
        <Login 
          onLogin={handleLogin} 
          onForgotPassword={handleForgotPassword}
          onContactUs={handleContactUs}
        />
        <Toast
          message="Logout realizado com sucesso!"
          type="info"
          isVisible={showLogoutToast}
          onClose={() => setShowLogoutToast(false)}
          duration={3000}
        />
      </>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'inicio':
        return <Inicio 
          onSilosUpdate={handleSilosUpdate} 
          showSuccess={showSuccess}
          showError={showError}
          showWarning={showWarning}
          showInfo={showInfo}
        />;
      case 'dashboard':
        return <Dashboard silos={silos} />;
      case 'historico':
        return <Historico />;
      case 'alertas':
        return <Alertas silos={silos} />;
      case 'relatorios':
        return <Relatorios />;
      default:
        return <Inicio 
          onSilosUpdate={handleSilosUpdate}
          showSuccess={showSuccess}
          showError={showError}
          showWarning={showWarning}
          showInfo={showInfo}
        />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header onLogout={handleLogout} silos={silos} />
      <main className="pb-20">
        {renderContent()}
      </main>
      <BottomNavigation activeTab={activeTab} onTabChange={setActiveTab} />
      
      {/* Sistema de Toasts */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
      
      <Toast
        message={`Bem-vindo de volta, ${userName}!`}
        type="success"
        isVisible={showWelcomeToast}
        onClose={() => setShowWelcomeToast(false)}
        duration={4000}
      />
    </div>
  );
}

export default App;

