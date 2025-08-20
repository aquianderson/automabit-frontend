import { AlertTriangle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';

const DeleteSiloModal = ({ isOpen, onClose, silo, onConfirm }) => {
  const handleConfirm = () => {
    onConfirm(silo.id);
    onClose();
  };

  if (!silo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[95vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-6 pb-4 border-b">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            Confirmar Remoção
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6 flex-1">
          <div className="py-4">
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Tem certeza?
              </h3>
              <p className="text-sm text-gray-500 mb-4">
                Esta ação não pode ser desfeita. O silo será removido permanentemente do sistema.
              </p>
              
              {/* Informações do Silo */}
              <div className="bg-gray-50 p-4 rounded-lg text-left">
                <h4 className="font-medium text-gray-900 mb-2">Silo a ser removido:</h4>
                <div className="space-y-1 text-sm text-gray-600">
                  <p><strong>Nome:</strong> {silo.name}</p>
                  <p><strong>Produto:</strong> {silo.product}</p>
                  <p><strong>Localização:</strong> {silo.location}</p>
                  <p><strong>Capacidade atual:</strong> {silo.capacity}%</p>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="flex gap-3">
              <button
                onClick={onClose}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirm}
                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors"
              >
                Sim, Remover
              </button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteSiloModal;
