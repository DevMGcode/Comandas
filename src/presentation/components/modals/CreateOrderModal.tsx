import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Table } from '@domain/entities/Table';
import { MenuItem } from '@domain/entities/MenuItem';
import { MenuItemCategory } from '@domain/types';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useMenuStore } from '../../stores/menu.store';
import { useOrderStore } from '../../stores/order.store';
import { useAuthStore } from '../../stores/auth.store';
import { notificationService } from '@infrastructure/services/notification.service';

interface CreateOrderModalProps {
  table: Table;
  onClose: () => void;
}

export const CreateOrderModal: React.FC<CreateOrderModalProps> = ({ table, onClose }) => {
  const { items: menuItems, loadMenuItems } = useMenuStore();
  const { createOrder } = useOrderStore();
  const user = useAuthStore(state => state.user);
  
  const [selectedCategory, setSelectedCategory] = useState<MenuItemCategory | 'all'>('all');
  const [cart, setCart] = useState<Map<string, { item: MenuItem; quantity: number; notes: string }>>(new Map());
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    loadMenuItems();
  }, [loadMenuItems]);

  const categories = [
    { value: 'all' as const, label: 'Todos' },
    { value: MenuItemCategory.APPETIZER, label: 'Entradas' },
    { value: MenuItemCategory.MAIN_COURSE, label: 'Principales' },
    { value: MenuItemCategory.DESSERT, label: 'Postres' },
    { value: MenuItemCategory.BEVERAGE, label: 'Bebidas' },
  ];

  const filteredItems = selectedCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === selectedCategory);

  const addToCart = (item: MenuItem) => {
    const existing = cart.get(item.id);
    if (existing) {
      setCart(new Map(cart.set(item.id, { ...existing, quantity: existing.quantity + 1 })));
    } else {
      setCart(new Map(cart.set(item.id, { item, quantity: 1, notes: '' })));
    }
  };

  const removeFromCart = (itemId: string) => {
    const existing = cart.get(itemId);
    if (existing && existing.quantity > 1) {
      setCart(new Map(cart.set(itemId, { ...existing, quantity: existing.quantity - 1 })));
    } else {
      const newCart = new Map(cart);
      newCart.delete(itemId);
      setCart(newCart);
    }
  };

  const updateNotes = (itemId: string, notes: string) => {
    const existing = cart.get(itemId);
    if (existing) {
      setCart(new Map(cart.set(itemId, { ...existing, notes })));
    }
  };

  const getTotalAmount = () => {
    return Array.from(cart.values()).reduce((sum, { item, quantity }) => sum + item.price * quantity, 0);
  };

  const getTotalItems = () => {
    return Array.from(cart.values()).reduce((sum, { quantity }) => sum + quantity, 0);
  };

  const handleSubmit = async () => {
    if (cart.size === 0) {
      notificationService.warning('Agrega al menos un item al pedido');
      return;
    }

    if (!user) {
      notificationService.error('Usuario no autenticado');
      return;
    }

    setIsSubmitting(true);
    try {
      const orderItems = Array.from(cart.values()).map(({ item, quantity, notes }) => ({
        menuItemId: item.id,
        menuItemName: item.name,
        quantity,
        unitPrice: item.price,
        notes,
      }));

      await createOrder(table.id, user.id, orderItems);
      notificationService.success('Pedido creado exitosamente');
      onClose();
    } catch (error) {
      notificationService.error('Error al crear el pedido');
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
          className="relative z-10 w-full max-w-6xl max-h-[90vh] overflow-hidden"
        >
          <Card className="h-full">
            {/* Header */}
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
              <div>
                <h2 className="text-2xl font-bold text-dark-50">Nuevo Pedido</h2>
                <p className="text-dark-400">Mesa {table.number} · {table.capacity} personas</p>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 flex items-center justify-center glass rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-6 h-6 text-dark-300" />
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 overflow-hidden">
              {/* Menu Items */}
              <div className="lg:col-span-2 overflow-y-auto max-h-[60vh] scrollbar-hide">
                {/* Categories */}
                <div className="flex gap-2 mb-4 overflow-x-auto scrollbar-hide">
                  {categories.map((cat) => (
                    <button
                      key={cat.value}
                      onClick={() => setSelectedCategory(cat.value)}
                      className={`px-4 py-2 rounded-lg font-medium transition-all whitespace-nowrap ${
                        selectedCategory === cat.value
                          ? 'bg-primary-500 text-white'
                          : 'glass text-dark-300 hover:text-dark-100'
                      }`}
                    >
                      {cat.label}
                    </button>
                  ))}
                </div>

                {/* Items Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredItems.map((item) => (
                    <Card
                      key={item.id}
                      className="cursor-pointer hover:border-primary-500/50 transition-all"
                      onClick={() => addToCart(item)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-dark-50 mb-1">{item.name}</h3>
                          <p className="text-dark-400 text-sm mb-2">{item.description}</p>
                          <div className="flex items-center gap-2">
                            <span className="text-xl font-bold text-primary-400">
                              ${item.price.toFixed(2)}
                            </span>
                            <span className="text-xs text-dark-500">· {item.preparationTime} min</span>
                          </div>
                        </div>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            addToCart(item);
                          }}
                          className="w-10 h-10 rounded-lg bg-primary-500 hover:bg-primary-600 flex items-center justify-center transition-colors"
                        >
                          <Plus className="w-5 h-5 text-white" />
                        </button>
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Cart */}
              <div className="flex flex-col h-[60vh]">
                <div className="flex items-center gap-2 mb-4">
                  <ShoppingCart className="w-5 h-5 text-primary-400" />
                  <h3 className="text-lg font-bold text-dark-50">
                    Carrito ({getTotalItems()})
                  </h3>
                </div>

                <div className="flex-1 overflow-y-auto scrollbar-hide space-y-3 mb-4">
                  {Array.from(cart.values()).map(({ item, quantity, notes }) => (
                    <Card key={item.id} className="p-4">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <p className="font-medium text-dark-50">{item.name}</p>
                          <p className="text-sm text-dark-400">${item.price.toFixed(2)}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="w-8 text-center font-bold text-dark-50">{quantity}</span>
                          <button
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 rounded-lg glass hover:bg-white/10 flex items-center justify-center"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <input
                        type="text"
                        placeholder="Notas especiales..."
                        value={notes}
                        onChange={(e) => updateNotes(item.id, e.target.value)}
                        className="input text-sm"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </Card>
                  ))}
                  
                  {cart.size === 0 && (
                    <div className="text-center py-12 text-dark-400">
                      <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                      <p>El carrito está vacío</p>
                    </div>
                  )}
                </div>

                {/* Total and Submit */}
                <div className="border-t border-white/10 pt-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-dark-300">Total:</span>
                    <span className="text-2xl font-bold text-primary-400">
                      ${getTotalAmount().toFixed(2)}
                    </span>
                  </div>
                  <Button
                    variant="primary"
                    size="lg"
                    className="w-full"
                    onClick={handleSubmit}
                    isLoading={isSubmitting}
                    disabled={cart.size === 0}
                  >
                    Crear Pedido
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
