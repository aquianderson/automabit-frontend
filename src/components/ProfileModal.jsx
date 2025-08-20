import { User, MapPin, Phone, Mail, Calendar, Building, Crop, Settings, Edit, Save, X, Bell, Shield, Eye, Moon, Globe } from 'lucide-react';
import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const ProfileModal = ({ isOpen, onClose, onLogout }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutProgress, setLogoutProgress] = useState(0);
  const [showSettings, setShowSettings] = useState(false);
  const [settings, setSettings] = useState({
    notifications: {
      emailAlerts: true,
      pushNotifications: true,
      alertsSound: false,
      dailyReports: true,
      weeklyReports: false
    },
    security: {
      twoFactorAuth: false,
      sessionTimeout: '30',
      passwordExpiry: '90'
    },
    display: {
      darkMode: false,
      language: 'pt-BR',
      timezone: 'America/Sao_Paulo',
      dateFormat: 'DD/MM/YYYY'
    },
    alerts: {
      temperatureThreshold: '28',
      humidityThreshold: '65',
      capacityThreshold: '85'
    }
  });
  const [profileData, setProfileData] = useState({
    // Dados da Fazenda/Cliente
    farmName: 'Fazenda São José',
    ownerName: 'João Silva Santos',
    email: 'joao.santos@fazendaosao.com.br',
    phone: '(11) 99999-8888',
    address: 'Rodovia SP-310, Km 245, Zona Rural',
    city: 'Ribeirão Preto',
    state: 'SP',
    cep: '14000-000',
    cnpj: '12.345.678/0001-90',
    registrationDate: '15/03/2023',
    farmSize: '1.250 hectares',
    mainCrops: ['Milho', 'Soja', 'Trigo'],
    silosCount: 3,
    totalCapacity: '150 toneladas',
    // Dados do Sistema
    plan: 'Premium',
    lastLogin: new Date().toLocaleString('pt-BR'),
    systemVersion: 'v1.0.0'
  });

  const [editData, setEditData] = useState(profileData);

  // Carregar dados do usuário logado
  useEffect(() => {
    const user = localStorage.getItem('automabit_user');
    if (user) {
      try {
        const userData = JSON.parse(user);
        setProfileData(prev => ({
          ...prev,
          ownerName: userData.name || prev.ownerName,
          farmName: userData.farm || prev.farmName,
          email: userData.email || prev.email,
          lastLogin: new Date(userData.loginTime).toLocaleString('pt-BR')
        }));
      } catch (error) {
        console.error('Erro ao carregar dados do usuário:', error);
      }
    }
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
    setEditData({ ...profileData });
  };

  const handleSave = () => {
    setProfileData({ ...editData });
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditData({ ...profileData });
    setIsEditing(false);
  };

  const handleInputChange = (field, value) => {
    setEditData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setLogoutProgress(0);
    
    // Simula o processo de logout com progresso animado
    const progressInterval = setInterval(() => {
      setLogoutProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 5; // Incrementa 5% a cada 100ms
      });
    }, 100);
    
    setTimeout(() => {
      onClose();
      onLogout();
      setIsLoggingOut(false);
      setLogoutProgress(0);
    }, 2000);
  };

  const handleSettingsToggle = (category, setting) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: !prev[category][setting]
      }
    }));
  };

  const handleSettingsChange = (category, setting, value) => {
    setSettings(prev => ({
      ...prev,
      [category]: {
        ...prev[category],
        [setting]: value
      }
    }));
  };

  const showProfileView = () => {
    setShowSettings(false);
  };

  const showSettingsView = () => {
    setShowSettings(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-[95vw] sm:max-w-2xl max-h-[95vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <User className="h-5 w-5" />
            {showSettings ? 'Configurações' : 'Perfil da Fazenda'}
            {!showSettings && (
              <div className="flex items-center gap-2 ml-auto">
                {isEditing ? (
                  <>
                    <button
                      onClick={handleSave}
                      className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      title="Salvar alterações"
                    >
                      <Save className="h-4 w-4" />
                    </button>
                    <button
                      onClick={handleCancel}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      title="Cancelar edição"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={handleEdit}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    title="Editar perfil"
                  >
                    <Edit className="h-4 w-4" />
                  </button>
                )}
              </div>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 overflow-y-auto flex-1">
          {showSettings ? (
            /* Visualização das Configurações */
            <div className="space-y-6">
              {/* Notificações */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5 text-blue-600" />
                  Notificações
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Alertas por Email</label>
                      <p className="text-xs text-gray-500">Receber alertas importantes por email</p>
                    </div>
                    <button
                      onClick={() => handleSettingsToggle('notifications', 'emailAlerts')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.emailAlerts ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.emailAlerts ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Notificações Push</label>
                      <p className="text-xs text-gray-500">Notificações no navegador</p>
                    </div>
                    <button
                      onClick={() => handleSettingsToggle('notifications', 'pushNotifications')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.pushNotifications ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.pushNotifications ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Som dos Alertas</label>
                      <p className="text-xs text-gray-500">Tocar som quando receber alertas</p>
                    </div>
                    <button
                      onClick={() => handleSettingsToggle('notifications', 'alertsSound')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.alertsSound ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.alertsSound ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Relatórios Diários</label>
                      <p className="text-xs text-gray-500">Receber resumo diário por email</p>
                    </div>
                    <button
                      onClick={() => handleSettingsToggle('notifications', 'dailyReports')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.notifications.dailyReports ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.notifications.dailyReports ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>

              {/* Segurança */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-600" />
                  Segurança
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Autenticação em 2 Fatores</label>
                      <p className="text-xs text-gray-500">Adicionar camada extra de segurança</p>
                    </div>
                    <button
                      onClick={() => handleSettingsToggle('security', 'twoFactorAuth')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.security.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.security.twoFactorAuth ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Timeout da Sessão (minutos)</label>
                    <select
                      value={settings.security.sessionTimeout}
                      onChange={(e) => handleSettingsChange('security', 'sessionTimeout', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="15">15 minutos</option>
                      <option value="30">30 minutos</option>
                      <option value="60">1 hora</option>
                      <option value="120">2 horas</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Aparência */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Eye className="h-5 w-5 text-purple-600" />
                  Aparência
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Modo Escuro</label>
                      <p className="text-xs text-gray-500">Alternar entre tema claro e escuro</p>
                    </div>
                    <button
                      onClick={() => handleSettingsToggle('display', 'darkMode')}
                      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                        settings.display.darkMode ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                          settings.display.darkMode ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Idioma</label>
                    <select
                      value={settings.display.language}
                      onChange={(e) => handleSettingsChange('display', 'language', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="pt-BR">Português (Brasil)</option>
                      <option value="en-US">English (US)</option>
                      <option value="es-ES">Español</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Thresholds de Alertas */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Settings className="h-5 w-5 text-orange-600" />
                  Limites de Alertas
                </h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Temperatura Crítica (°C)</label>
                    <input
                      type="number"
                      value={settings.alerts.temperatureThreshold}
                      onChange={(e) => handleSettingsChange('alerts', 'temperatureThreshold', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="20"
                      max="40"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Umidade Crítica (%)</label>
                    <input
                      type="number"
                      value={settings.alerts.humidityThreshold}
                      onChange={(e) => handleSettingsChange('alerts', 'humidityThreshold', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="50"
                      max="80"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">Capacidade Crítica (%)</label>
                    <input
                      type="number"
                      value={settings.alerts.capacityThreshold}
                      onChange={(e) => handleSettingsChange('alerts', 'capacityThreshold', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      min="70"
                      max="95"
                    />
                  </div>
                </div>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 pt-4 border-t">
                <button 
                  onClick={showProfileView}
                  className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Voltar ao Perfil
                </button>
                <button 
                  onClick={handleLogout}
                  className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                >
                  <User className="h-4 w-4" />
                  Sair
                </button>
              </div>
            </div>
          ) : (
            /* Visualização do Perfil */
          <div className="space-y-6">
            {/* Avatar e Informações Principais */}
            <div className="text-center pb-6 border-b">
              <div className="relative w-20 h-20 mx-auto mb-4">
                <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center">
                  <User className="h-10 w-10 text-blue-600" />
                </div>
                {/* Indicador Online */}
                <div className="absolute bottom-1 right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></div>
              </div>
              <h2 className="text-xl font-bold text-gray-900">{profileData.farmName}</h2>
              <p className="text-gray-600">{profileData.ownerName}</p>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 mt-2">
                ● Online
              </span>
              <div className="flex justify-center gap-6 mt-4">
                <div className="text-center">
                  <div className="font-bold text-blue-600 text-lg">{profileData.silosCount}</div>
                  <div className="text-gray-500 text-sm">Silos</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-green-600 text-lg">{profileData.totalCapacity}</div>
                  <div className="text-gray-500 text-sm">Capacidade</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-yellow-600 text-lg">{profileData.mainCrops.length}</div>
                  <div className="text-gray-500 text-sm">Culturas</div>
                </div>
              </div>
            </div>
            {/* Informações Básicas da Fazenda */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Building className="h-5 w-5 text-green-600" />
                Informações da Fazenda
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Nome da Fazenda</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.farmName}
                      onChange={(e) => handleInputChange('farmName', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.farmName}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Proprietário</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.ownerName}
                      onChange={(e) => handleInputChange('ownerName', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.ownerName}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">CNPJ</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.cnpj}
                      onChange={(e) => handleInputChange('cnpj', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.cnpj}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Área da Fazenda</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.farmSize}
                      onChange={(e) => handleInputChange('farmSize', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.farmSize}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Informações de Contato */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Phone className="h-5 w-5 text-blue-600" />
                Contato
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  {isEditing ? (
                    <input
                      type="email"
                      value={editData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900 break-words">{profileData.email}</p>
                  )}
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Telefone</label>
                  {isEditing ? (
                    <input
                      type="tel"
                      value={editData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.phone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <MapPin className="h-5 w-5 text-red-600" />
                Endereço
              </h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Endereço</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={editData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  ) : (
                    <p className="mt-1 text-sm text-gray-900">{profileData.address}</p>
                  )}
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-600">Cidade</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.city}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">Estado</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.state}
                        onChange={(e) => handleInputChange('state', e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.state}</p>
                    )}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-600">CEP</label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editData.cep}
                        onChange={(e) => handleInputChange('cep', e.target.value)}
                        className="mt-1 w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <p className="mt-1 text-sm text-gray-900">{profileData.cep}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Informações de Produção */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Crop className="h-5 w-5 text-yellow-600" />
                Produção
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Principais Culturas</label>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {profileData.mainCrops.map((crop, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                      >
                        {crop}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Quantidade de Silos</label>
                  <p className="mt-1 text-sm text-gray-900">{profileData.silosCount} silos</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Capacidade Total</label>
                  <p className="mt-1 text-sm text-gray-900">{profileData.totalCapacity}</p>
                </div>
              </div>
            </div>

            {/* Informações do Sistema */}
            <div>
              <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                <Settings className="h-5 w-5 text-gray-600" />
                Sistema
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Plano</label>
                  <span className="mt-1 block px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full w-fit">
                    {profileData.plan}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Data de Cadastro</label>
                  <p className="mt-1 text-sm text-gray-900">{profileData.registrationDate}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Último Acesso</label>
                  <p className="mt-1 text-sm text-gray-900">{profileData.lastLogin}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-600">Versão do Sistema</label>
                  <p className="mt-1 text-sm text-gray-900">{profileData.systemVersion}</p>
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-3 pt-4 border-t">
              <button 
                onClick={showSettingsView}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Configurações
              </button>
              <button 
                onClick={handleLogout}
                className="flex-1 bg-red-100 text-red-700 py-2 px-4 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
              >
                <User className="h-4 w-4" />
                Sair
              </button>
            </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>

    {/* Overlay de Logout Melhorado */}
    {isLoggingOut && (
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center z-[9999]">
        {/* Padrão geométrico sutil de fundo */}
        <div className="absolute inset-0 opacity-10">
          <svg className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
                <circle cx="20" cy="20" r="1" fill="#3b82f6"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)"/>
          </svg>
        </div>
        
        {/* Círculos decorativos flutuantes */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute w-32 h-32 bg-blue-200 bg-opacity-30 rounded-full blur-xl animate-pulse" style={{ top: '10%', left: '10%', animationDelay: '0s' }}></div>
          <div className="absolute w-24 h-24 bg-indigo-200 bg-opacity-20 rounded-full blur-lg animate-pulse" style={{ top: '70%', right: '15%', animationDelay: '1s' }}></div>
          <div className="absolute w-40 h-40 bg-purple-200 bg-opacity-15 rounded-full blur-2xl animate-pulse" style={{ bottom: '20%', left: '20%', animationDelay: '2s' }}></div>
        </div>
        
        {/* Container principal do logout */}
        <div className="relative bg-white backdrop-blur-sm rounded-2xl p-10 flex flex-col items-center shadow-xl border border-gray-100 max-w-sm w-full mx-4 logout-container">
          {/* Logo/Ícone AutomaBit */}
          <div className="relative mb-6 logout-icon">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center shadow-lg">
              <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
              </svg>
            </div>
            {/* Anel de carregamento ao redor do ícone */}
            <div className="absolute inset-0 border-4 border-blue-100 border-t-blue-500 rounded-full animate-spin"></div>
          </div>
          
          {/* Texto principal */}
          <h3 className="text-2xl font-bold mb-3 bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">
            Saindo do Sistema
          </h3>
          
          {/* Subtexto com animação e mensagens dinâmicas */}
          <p className="text-gray-600 text-center mb-4 animate-pulse">
            {logoutProgress < 30 ? 'Salvando dados...' :
             logoutProgress < 60 ? 'Finalizando sessão...' :
             logoutProgress < 90 ? 'Limpando cache...' :
             'Redirecionando...'}
          </p>
          
          {/* Barra de progresso animada */}
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4 overflow-hidden">
            <div 
              className="h-2 bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 rounded-full transition-all duration-300 ease-out"
              style={{ width: `${logoutProgress}%` }}
            ></div>
          </div>
          
          {/* Mensagem de agradecimento */}
          <p className="text-sm text-gray-500 text-center">
            Obrigado por usar o <span className="font-semibold text-blue-600">AutomaBit</span>
          </p>
        </div>
      </div>
    )}
    </>
  );
};

export default ProfileModal;
