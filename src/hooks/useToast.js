import { useState, useCallback, useRef } from 'react';

const useToast = () => {
  const [toasts, setToasts] = useState([]);
  const timeoutsRef = useRef(new Map());

  const addToast = useCallback((type, title, message) => {
    // Verificar se já existe um toast com o mesmo título e mensagem nos últimos 2 segundos
    setToasts(prev => {
      const now = Date.now();
      const existingToast = prev.find(toast => 
        toast.title === title && 
        toast.message === message &&
        (now - toast.timestamp.getTime()) < 2000 // Menos de 2 segundos
      );
      
      if (existingToast) {
        // Se já existe um toast similar recente, não adicionar duplicata
        return prev;
      }
      
      const id = Date.now() + Math.random();
      const newToast = {
        id,
        type,
        title,
        message,
        timestamp: new Date()
      };

      // Auto remove after 5 seconds
      const timeoutId = setTimeout(() => {
        setToasts(current => current.filter(toast => toast.id !== id));
        timeoutsRef.current.delete(id);
      }, 5000);

      // Store timeout reference for cleanup
      timeoutsRef.current.set(id, timeoutId);
      
      return [...prev, newToast];
    });
  }, []);

  const removeToast = useCallback((id) => {
    // Clear timeout if exists
    const timeoutId = timeoutsRef.current.get(id);
    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutsRef.current.delete(id);
    }
    
    setToasts(prev => prev.filter(toast => toast.id !== id));
  }, []);

  const clearAllToasts = useCallback(() => {
    // Clear all timeouts
    timeoutsRef.current.forEach((timeoutId) => {
      clearTimeout(timeoutId);
    });
    timeoutsRef.current.clear();
    
    setToasts([]);
  }, []);

  // Convenience methods
  const showSuccess = useCallback((title, message) => {
    addToast('success', title, message);
  }, [addToast]);

  const showError = useCallback((title, message) => {
    addToast('error', title, message);
  }, [addToast]);

  const showWarning = useCallback((title, message) => {
    addToast('warning', title, message);
  }, [addToast]);

  const showInfo = useCallback((title, message) => {
    addToast('info', title, message);
  }, [addToast]);

  const showCritical = useCallback((title, message) => {
    addToast('critical', title, message);
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    clearAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showCritical
  };
};

export default useToast;
