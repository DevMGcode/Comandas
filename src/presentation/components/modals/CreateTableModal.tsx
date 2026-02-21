import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Users } from 'lucide-react';
import { Card } from '../ui/Card';
import { Button } from '../ui/Button';
import { notificationService } from '@infrastructure/services/notification.service';

interface CreateTableModalProps {
  onClose: () => void;
  onSubmit: (number: number, capacity: number, location: string) => Promise<void>;
}

export const CreateTableModal: React.FC<CreateTableModalProps> = ({ onClose, onSubmit }) => {
  const [number, setNumber] = useState('');
  const [capacity, setCapacity] = useState('4');
  const [location, setLocation] = useState('main');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!number) {
      notificationService.warning('Ingresa el número de mesa');
      return;
    }

    const tableNumber = parseInt(number);
    const tableCapacity = parseInt(capacity);

    if (isNaN(tableNumber) || tableNumber <= 0) {
      notificationService.error('Número de mesa inválido');
      return;
    }

    if (isNaN(tableCapacity) || tableCapacity <= 0) {
      notificationService.error('Capacidad inválida');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(tableNumber, tableCapacity, location);
      notificationService.success('Mesa creada exitosamente');
      onClose();
    } catch (error) {
      notificationService.error((error as Error).message || 'Error al crear la mesa');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative z-10 w-full max-w-md"
        >
          <Card>
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <h2 className="text-2xl font-bold text-dark-50">Nueva Mesa</h2>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center glass rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-dark-300" />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              {/* Número de Mesa */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Número de Mesa
                </label>
                <input
                  type="number"
                  min="1"
                  value={number}
                  onChange={(e) => setNumber(e.target.value)}
                  placeholder="Ej: 15"
                  className="input"
                  autoFocus
                />
              </div>

              {/* Capacidad */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Capacidad
                </label>
                <div className="flex gap-2">
                  {[2, 4, 6, 8].map((cap) => (
                    <button
                      key={cap}
                      type="button"
                      onClick={() => setCapacity(cap.toString())}
                      className={`flex-1 py-3 rounded-lg font-medium transition-all ${
                        capacity === cap.toString()
                          ? 'bg-primary-500 text-white'
                          : 'glass text-dark-300 hover:text-dark-100'
                      }`}
                    >
                      <Users className="w-5 h-5 mx-auto mb-1" />
                      {cap}
                    </button>
                  ))}
                </div>
              </div>

              {/* Ubicación */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-dark-300 mb-2">
                  Ubicación
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setLocation('main')}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      location === 'main'
                        ? 'bg-primary-500 text-white'
                        : 'glass text-dark-300 hover:text-dark-100'
                    }`}
                  >
                    Principal
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('terrace')}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      location === 'terrace'
                        ? 'bg-primary-500 text-white'
                        : 'glass text-dark-300 hover:text-dark-100'
                    }`}
                  >
                    Terraza
                  </button>
                  <button
                    type="button"
                    onClick={() => setLocation('vip')}
                    className={`py-3 rounded-lg font-medium transition-all ${
                      location === 'vip'
                        ? 'bg-primary-500 text-white'
                        : 'glass text-dark-300 hover:text-dark-100'
                    }`}
                  >
                    VIP
                  </button>
                </div>
              </div>

              {/* Buttons */}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="ghost"
                  size="lg"
                  onClick={onClose}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Creando...' : 'Crear Mesa'}
                </Button>
              </div>
            </form>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
