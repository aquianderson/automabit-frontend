import { useState, useEffect, useCallback } from 'react';
import { Plus } from 'lucide-react';
import SiloCard from '../components/SiloCard';
import SiloModal from '../components/SiloModal';
import CreateSiloModal from '../components/CreateSiloModal';
import DeleteSiloModal from '../components/DeleteSiloModal';

const Inicio = ({ onSilosUpdate, showSuccess, showError, showWarning, showInfo }) => {
  // Flag para controlar se o toast de sistema iniciado já foi mostrado
  const [systemStartedToastShown, setSystemStartedToastShown] = useState(false);
  
  // Função para gerar valores aleatórios dentro de uma faixa
  const generateRandomValue = (min, max, decimals = 0) => {
    const value = Math.random() * (max - min) + min;
    return decimals > 0 ? parseFloat(value.toFixed(decimals)) : Math.floor(value);
  };

  // Função para determinar o status baseado nos valores dos sensores
  const calculateStatus = (capacity, temperature, humidity) => {
    if (capacity >= 90 || temperature >= 30 || humidity >= 70) {
      return 'Alerta';
    } else if (capacity >= 75 || temperature >= 27 || humidity >= 65) {
      return 'Atenção';
    }
    return 'Normal';
  };

  const [silos, setSilos] = useState([
    {
      id: 1,
      name: 'Silo 1 - Milho',
      product: 'Milho',
      location: 'Armazém - Setor 08/10',
      status: 'Alerta',
      capacity: 85,
      temperature: 25,
      humidity: 60,
      weight: 45
    },
    {
      id: 2,
      name: 'Silo 2 - Soja',
      product: 'Soja',
      location: 'Armazém - Setor 04/10',
      status: 'Atenção',
      capacity: 92,
      temperature: 22,
      humidity: 55,
      weight: 38
    },
    {
      id: 3,
      name: 'Silo 3 - Trigo',
      product: 'Trigo',
      location: 'Armazém - Setor 06/10',
      status: 'Normal',
      capacity: 45,
      temperature: 20,
      humidity: 50,
      weight: 28
    }
  ]);

  const [selectedSilo, setSelectedSilo] = useState(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [siloToDelete, setSiloToDelete] = useState(null);
  const [newSiloInfo, setNewSiloInfo] = useState(null);

  // Função para atualizar os dados dos sensores com simulação mais realística
  const updateSensorData = useCallback(() => {
    setSilos(prevSilos => 
      prevSilos.map(silo => {
        // Simulação de conectividade (95% de chance de estar conectado)
        const isConnected = Math.random() > 0.05;

        // Se desconectado, manter valores anteriores
        if (!isConnected) {
          return {
            ...silo,
            conectado: false
          };
        }

        // Variações graduais baseadas em valores anteriores (mais realístico)
        const baseTemp = silo.temperature || 25;
        const baseHumidity = silo.humidity || 60;
        const baseCapacity = silo.capacity || 50;
        const baseWeight = silo.weight || 30;
        
        // Pequenas variações graduais
        const tempChange = (Math.random() - 0.5) * 2; // -1°C a +1°C
        const humidityChange = (Math.random() - 0.5) * 4; // -2% a +2%
        const capacityChange = (Math.random() - 0.5) * 3; // -1.5% a +1.5%
        const weightChange = (Math.random() - 0.5) * 2; // -1kg a +1kg

        // Aplicar mudanças graduais
        const newTemperature = Math.max(15, Math.min(40, baseTemp + tempChange));
        const newHumidity = Math.max(30, Math.min(80, baseHumidity + humidityChange));
        const newCapacity = Math.max(10, Math.min(100, baseCapacity + capacityChange));
        const newWeight = Math.max(15, Math.min(50, baseWeight + weightChange));

        return {
          ...silo,
          capacity: parseFloat(newCapacity.toFixed(1)),
          temperature: parseFloat(newTemperature.toFixed(1)),
          humidity: Math.floor(newHumidity),
          weight: parseFloat(newWeight.toFixed(1)),
          conectado: true,
          status: calculateStatus(newCapacity, newTemperature, newHumidity)
        };
      })
    );
  }, []);

  // Calcular visão geral baseada nos dados atuais
  const visaoGeral = {
    silosAtivos: silos.length,
    capacidadeTotal: silos.length > 0 ? Math.round(silos.reduce((acc, silo) => acc + silo.capacity, 0) / silos.length) : 0,
    alertas: silos.filter(silo => silo.status === 'Alerta' || silo.status === 'Atenção').length
  };

  const handleSiloClick = (silo) => {
    setSelectedSilo(silo);
    setIsViewModalOpen(true);
  };

  const handleCloseViewModal = () => {
    setIsViewModalOpen(false);
    setSelectedSilo(null);
  };

  const handleDeleteSilo = (silo) => {
    setSiloToDelete(silo);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = (siloId) => {
    setSilos(prevSilos => prevSilos.filter(silo => silo.id !== siloId));
    setIsDeleteModalOpen(false);
    setSiloToDelete(null);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setSiloToDelete(null);
  };

  const handleCreateSilo = (siloData) => {
    const newSilo = {
      id: Math.max(...silos.map(s => s.id)) + 1,
      ...siloData,
      capacity: Math.floor(Math.random() * 30) + 20, // 20-50%
      temperature: Math.floor(Math.random() * 10) + 18, // 18-28°C
      humidity: Math.floor(Math.random() * 20) + 45, // 45-65%
      weight: Math.floor(Math.random() * 20) + 25, // 25-45 toneladas
      status: 'Normal'
    };

    setSilos(prev => [...prev, newSilo]);
    setNewSiloInfo(newSilo);
    setIsCreateModalOpen(false);
    
    // Mostrar informações do silo criado
    setTimeout(() => {
      setSelectedSilo(newSilo);
      setIsViewModalOpen(true);
    }, 500);
  };

  // Atualizar o silo selecionado quando os dados mudarem
  useEffect(() => {
    if (selectedSilo && silos.length > 0) {
      const updatedSilo = silos.find(s => s.id === selectedSilo.id);
      if (updatedSilo) {
        setSelectedSilo(updatedSilo);
      }
    }
  }, [silos, selectedSilo]);

  // Configurar intervalo para atualização dos sensores
  useEffect(() => {
    // Mostrar notificação de sistema iniciado apenas uma vez na primeira carga
    // Aguarda 4.5 segundos para aparecer após o toast de boas-vindas (que dura 4s)
    if (showSuccess && silos.length > 0 && !systemStartedToastShown) {
      const timer = setTimeout(() => {
        showSuccess(
          'Sistema Iniciado',
          `Monitorando ${silos.length} silo(s) em tempo real`
        );
        setSystemStartedToastShown(true);
      }, 4500); // Aguarda 4.5 segundos

      return () => clearTimeout(timer);
    }

    const interval = setInterval(() => {
      updateSensorData();
    }, 30000); // Atualiza a cada 30 segundos

    return () => clearInterval(interval);
  }, [updateSensorData, showSuccess, silos.length, systemStartedToastShown]);

  // Notificar App.jsx sobre mudanças nos silos
  useEffect(() => {
    if (onSilosUpdate && silos.length > 0) {
      onSilosUpdate(silos);
    }
  }, [silos, onSilosUpdate]);

  // Adicionar notificações para operações de silo
  const handleCreateSiloWithNotification = (siloData) => {
    handleCreateSilo(siloData);
    if (showSuccess) {
      showSuccess(
        'Silo Criado',
        `${siloData.name} foi criado e está coletando dados`
      );
    }
  };

  const handleConfirmDeleteWithNotification = () => {
    if (siloToDelete && showSuccess) {
      showSuccess(
        'Silo Removido',
        `${siloToDelete.name} foi removido com sucesso`
      );
    }
    handleConfirmDelete();
  };

  return (
    <div className="main-content">
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Visão Geral</h2>
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="bg-green-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{visaoGeral.silosAtivos}</div>
            <div className="text-sm text-gray-600">Silos Ativos</div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{visaoGeral.capacidadeTotal}%</div>
            <div className="text-sm text-gray-600">Capacidade</div>
          </div>
          <div className="bg-red-50 p-4 rounded-lg text-center">
            <div className="text-2xl font-bold text-red-600">{visaoGeral.alertas}</div>
            <div className="text-sm text-gray-600">Alertas</div>
          </div>
        </div>
      </div>

      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Seus Silos</h3>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            Adicionar Silo
          </button>
        </div>
        {silos.map(silo => (
          <SiloCard 
            key={silo.id} 
            silo={silo} 
            onClick={() => handleSiloClick(silo)}
            onDelete={handleDeleteSilo}
          />
        ))}
      </div>

      {/* Modal para visualizar silo */}
      <SiloModal
        isOpen={isViewModalOpen}
        onClose={handleCloseViewModal}
        silo={selectedSilo}
      />

      {/* Modal para criar novo silo */}
      <CreateSiloModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateSilo={handleCreateSiloWithNotification}
      />

      {/* Modal para confirmar remoção de silo */}
      <DeleteSiloModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        silo={siloToDelete}
        onConfirm={handleConfirmDeleteWithNotification}
      />
    </div>
  );
};

export default Inicio;

