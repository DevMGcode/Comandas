import { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, ChefHat, DollarSign, Clock, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import { useMenuStore } from '@presentation/stores/menu.store';
import { useAuthStore } from '@presentation/stores/auth.store';
import { MenuItem } from '@domain/entities/MenuItem';
import { MenuItemCategory, UserRole } from '@domain/types';
import { Card } from '@presentation/components/ui/Card';
import { Button } from '@presentation/components/ui/Button';
import { CreateEditMenuItemModal } from '@presentation/components/modals/CreateEditMenuItemModal';
import { notificationService } from '@infrastructure/services/notification.service';

const categoryLabels: Record<MenuItemCategory, string> = {
  [MenuItemCategory.APPETIZER]: '🥗 Entradas',
  [MenuItemCategory.MAIN_COURSE]: '🍽️ Platos Principales',
  [MenuItemCategory.DESSERT]: '🍰 Postres',
  [MenuItemCategory.BEVERAGE]: '🥤 Bebidas',
  [MenuItemCategory.SPECIAL]: '⭐ Especiales',
};

export default function MenuManagementPage() {
  const { items, loadAllMenuItems, createMenuItem, updateMenuItem, toggleAvailability, deleteMenuItem } = useMenuStore();
  const { user } = useAuthStore();
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<MenuItemCategory | 'ALL'>('ALL');

  useEffect(() => {
    loadAllMenuItems();
  }, [loadAllMenuItems]);

  const handleCreate = () => {
    setEditingItem(null);
    setShowModal(true);
  };

  const handleEdit = (item: MenuItem) => {
    setEditingItem(item);
    setShowModal(true);
  };

  const handleSubmit = async (data: {
    name: string;
    description: string;
    price: number;
    category: MenuItemCategory;
    imageUrl?: string;
    preparationTime?: number;
    ingredients?: string[];
  }) => {
    try {
      if (editingItem) {
        await updateMenuItem(editingItem.id, data);
        notificationService.success('Plato actualizado correctamente');
      } else {
        await createMenuItem(data);
        notificationService.success('Plato creado correctamente');
      }
      setShowModal(false);
      setEditingItem(null);
    } catch (error) {
      notificationService.error((error as Error).message);
      throw error;
    }
  };

  const handleToggleAvailability = async (id: string) => {
    try {
      await toggleAvailability(id);
      notificationService.success('Disponibilidad actualizada');
    } catch (error) {
      notificationService.error((error as Error).message);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`¿Estás seguro de eliminar "${name}"?`)) return;

    try {
      await deleteMenuItem(id);
      notificationService.success('Plato eliminado correctamente');
    } catch (error) {
      notificationService.error((error as Error).message);
    }
  };

  const filteredItems = selectedCategory === 'ALL'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<MenuItemCategory, MenuItem[]>);

  // Verificar que el usuario tiene permisos (admin o mesero)
  const canManageMenu = user?.role === UserRole.ADMIN || user?.role === UserRole.WAITER;

  if (!canManageMenu) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <Card className="max-w-md text-center">
          <h2 className="text-2xl font-bold mb-4">⛔ Acceso Denegado</h2>
          <p className="text-gray-400">
            Solo administradores y meseros pueden gestionar el menú.
          </p>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <ChefHat className="w-8 h-8 text-purple-400" />
            Gestión del Menú
          </h1>
          <p className="text-gray-400 mt-1">
            Administra los platos disponibles en tu restaurante
          </p>
        </div>
        <Button
          variant="primary"
          onClick={handleCreate}
          className="flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Nuevo Plato
        </Button>
      </div>

      {/* Filtros por Categoría */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedCategory('ALL')}
          className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
            selectedCategory === 'ALL'
              ? 'bg-purple-500 text-white'
              : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
          }`}
        >
          📋 Todos ({items.length})
        </button>
        {Object.entries(categoryLabels).map(([key, label]) => {
          const count = items.filter(item => item.category === key).length;
          return (
            <button
              key={key}
              onClick={() => setSelectedCategory(key as MenuItemCategory)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                selectedCategory === key
                  ? 'bg-purple-500 text-white'
                  : 'bg-gray-800/50 text-gray-400 hover:bg-gray-800'
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {/* Listado de Platos */}
      {selectedCategory === 'ALL' ? (
        // Mostrar agrupado por categorías
        <div className="space-y-8">
          {Object.entries(groupedItems).map(([category, categoryItems]) => (
            <div key={category}>
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                {categoryLabels[category as MenuItemCategory]}
                <span className="text-sm text-gray-500">({categoryItems.length})</span>
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {categoryItems.map((item) => (
                  <MenuItemCard
                    key={item.id}
                    item={item}
                    onEdit={handleEdit}
                    onToggleAvailability={handleToggleAvailability}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          ))}
          {filteredItems.length === 0 && (
            <Card className="text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                No hay platos en el menú. ¡Agrega el primero!
              </p>
            </Card>
          )}
        </div>
      ) : (
        // Mostrar solo la categoría seleccionada
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredItems.map((item) => (
            <MenuItemCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onToggleAvailability={handleToggleAvailability}
              onDelete={handleDelete}
            />
          ))}
          {filteredItems.length === 0 && (
            <Card className="col-span-full text-center py-12">
              <ChefHat className="w-16 h-16 mx-auto text-gray-600 mb-4" />
              <p className="text-gray-400 text-lg">
                No hay platos en esta categoría
              </p>
            </Card>
          )}
        </div>
      )}

      {/* Modal */}
      <CreateEditMenuItemModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingItem(null);
        }}
        onSubmit={handleSubmit}
        menuItem={editingItem}
      />
    </div>
  );
}

interface MenuItemCardProps {
  item: MenuItem;
  onEdit: (item: MenuItem) => void;
  onToggleAvailability: (id: string) => void;
  onDelete: (id: string, name: string) => void;
}

function MenuItemCard({ item, onEdit, onToggleAvailability, onDelete }: MenuItemCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative"
    >
      <Card className={`h-full ${!item.isAvailable ? 'opacity-60' : ''}`}>
        {/* Badge de disponibilidad */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={() => onToggleAvailability(item.id)}
            className={`px-3 py-1 rounded-full text-xs font-semibold ${
              item.isAvailable
                ? 'bg-green-500/20 text-green-400 border border-green-500/50'
                : 'bg-red-500/20 text-red-400 border border-red-500/50'
            }`}
          >
            {item.isAvailable ? (
              <span className="flex items-center gap-1">
                <Eye className="w-3 h-3" /> Disponible
              </span>
            ) : (
              <span className="flex items-center gap-1">
                <EyeOff className="w-3 h-3" /> No Disponible
              </span>
            )}
          </button>
        </div>

        {/* Imagen */}
        {item.imageUrl && (
          <div className="w-full h-40 mb-4 rounded-lg overflow-hidden bg-gray-800">
            <img
              src={item.imageUrl}
              alt={item.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        )}

        {/* Contenido */}
        <h3 className="text-lg font-bold mb-2 pr-24">{item.name}</h3>
        <p className="text-sm text-gray-400 mb-4 line-clamp-2">
          {item.description}
        </p>

        {/* Información */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-sm">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="font-semibold text-green-400">
              ${item.price.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <Clock className="w-4 h-4" />
            <span>{item.preparationTime} min</span>
          </div>
          {item.ingredients.length > 0 && (
            <div className="text-xs text-gray-500 line-clamp-1">
              🧂 {item.ingredients.join(', ')}
            </div>
          )}
        </div>

        {/* Acciones */}
        <div className="flex gap-2 pt-4 border-t border-gray-800">
          <Button
            variant="secondary"
            onClick={() => onEdit(item)}
            className="flex-1 flex items-center justify-center gap-2"
          >
            <Edit2 className="w-4 h-4" />
            Editar
          </Button>
          <Button
            variant="danger"
            onClick={() => onDelete(item.id, item.name)}
            className="flex items-center justify-center gap-2"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
