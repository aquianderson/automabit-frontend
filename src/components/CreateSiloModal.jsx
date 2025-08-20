import { useState } from 'react';
import { Building, MapPin, Package } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const CreateSiloModal = ({ isOpen, onClose, onCreateSilo }) => {
  const [formData, setFormData] = useState({
    name: '',
    product: '',
    location: ''
  });

  const [errors, setErrors] = useState({});

  const products = [
    'Milho',
    'Soja',
    'Trigo',
    'Arroz',
    'Feijão',
    'Aveia',
    'Cevada',
    'Sorgo'
  ];

  const locations = [
    'Armazém - Setor 01/10',
    'Armazém - Setor 02/10',
    'Armazém - Setor 03/10',
    'Armazém - Setor 05/10',
    'Armazém - Setor 07/10',
    'Armazém - Setor 09/10',
    'Armazém - Setor 10/10',
    'Galpão A - Área Externa',
    'Galpão B - Área Externa',
    'Depósito Central'
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro quando o usuário começar a digitar
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Nome do silo é obrigatório';
    }

    if (!formData.product) {
      newErrors.product = 'Produto é obrigatório';
    }

    if (!formData.location) {
      newErrors.location = 'Localização é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (validateForm()) {
      onCreateSilo(formData);
      
      // Reset form
      setFormData({
        name: '',
        product: '',
        location: ''
      });
      setErrors({});
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      product: '',
      location: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Building className="h-5 w-5 text-blue-600" />
            Criar Novo Silo
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1 overflow-y-auto">
          <div className="space-y-4">
            {/* Nome do Silo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nome do Silo *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                placeholder="Ex: Silo 4 - Milho"
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name}</p>
              )}
            </div>

            {/* Produto */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <Package className="inline h-4 w-4 mr-1" />
                Produto *
              </label>
              <select
                value={formData.product}
                onChange={(e) => handleInputChange('product', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.product ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione um produto</option>
                {products.map(product => (
                  <option key={product} value={product}>{product}</option>
                ))}
              </select>
              {errors.product && (
                <p className="mt-1 text-sm text-red-600">{errors.product}</p>
              )}
            </div>

            {/* Localização */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                <MapPin className="inline h-4 w-4 mr-1" />
                Localização *
              </label>
              <select
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.location ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Selecione uma localização</option>
                {locations.map(location => (
                  <option key={location} value={location}>{location}</option>
                ))}
              </select>
              {errors.location && (
                <p className="mt-1 text-sm text-red-600">{errors.location}</p>
              )}
            </div>

            {/* Informação adicional */}
            <div className="bg-blue-50 p-3 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Nota:</strong> Os sensores serão configurados automaticamente e começarão a coletar dados em tempo real após a criação do silo.
              </p>
            </div>
          </div>

          {/* Botão */}
          <div className="mt-6 pt-4 border-t">
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Criar Silo
            </button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CreateSiloModal;
