import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ChefHat, 
  UtensilsCrossed,
  LogOut,
  Menu,
  X,
  BookOpen
} from 'lucide-react';
import { useAuthStore } from '../../stores/auth.store';
import { UserRole } from '@domain/types';
import { notificationService } from '@infrastructure/services/notification.service';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [sidebarOpen, setSidebarOpen] = React.useState(false);

  useEffect(() => {
    // Cerrar sidebar en mobile al cambiar de ruta
    setSidebarOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    notificationService.info('Sesión cerrada');
    navigate('/login');
  };

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.ADMIN, UserRole.WAITER, UserRole.CHEF] },
    { path: '/tables', label: 'Mesas', icon: Users, roles: [UserRole.ADMIN, UserRole.WAITER] },
    { path: '/menu', label: 'Menú del Día', icon: BookOpen, roles: [UserRole.ADMIN, UserRole.WAITER] },
    { path: '/kitchen', label: 'Cocina', icon: ChefHat, roles: [UserRole.ADMIN, UserRole.CHEF] },
  ];

  const filteredMenuItems = menuItems.filter(item => 
    user && item.roles.includes(user.role)
  );

  return (
    <div className="min-h-screen bg-dark-950 flex">
      {/* Sidebar para desktop */}
      <motion.aside
        initial={{ x: -300 }}
        animate={{ x: 0 }}
        className="hidden lg:flex lg:flex-col w-64 glass border-r border-white/10"
      >
        <div className="p-6 border-b border-white/10">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
              <UtensilsCrossed className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-dark-50">Comandas</h1>
              <p className="text-xs text-dark-400">Restaurant</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {filteredMenuItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                    : 'text-dark-300 hover:bg-white/5 hover:text-dark-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-white/10">
          <div className="glass rounded-lg p-4 mb-3">
            <p className="text-dark-400 text-sm mb-1">Usuario</p>
            <p className="text-dark-50 font-semibold">{user?.name}</p>
            <p className="text-dark-500 text-xs">{user?.email}</p>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Cerrar Sesión</span>
          </button>
        </div>
      </motion.aside>

      {/* Sidebar mobile */}
      {sidebarOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSidebarOpen(false)}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-40 lg:hidden"
          />
          <motion.aside
            initial={{ x: -300 }}
            animate={{ x: 0 }}
            exit={{ x: -300 }}
            className="fixed left-0 top-0 bottom-0 w-64 glass border-r border-white/10 z-50 lg:hidden flex flex-col"
          >
            <div className="p-6 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                  <UtensilsCrossed className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-dark-50">Comandas</h1>
                  <p className="text-xs text-dark-400">Restaurant</p>
                </div>
              </div>
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-10 h-10 flex items-center justify-center glass rounded-lg hover:bg-white/10"
              >
                <X className="w-6 h-6 text-dark-300" />
              </button>
            </div>

            <nav className="flex-1 p-4 space-y-2">
              {filteredMenuItems.map((item) => {
                const Icon = item.icon;
                const isActive = location.pathname === item.path;
                
                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                      isActive
                        ? 'bg-primary-500 text-white shadow-lg shadow-primary-500/30'
                        : 'text-dark-300 hover:bg-white/5 hover:text-dark-50'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                    <span className="font-medium">{item.label}</span>
                  </Link>
                );
              })}
            </nav>

            <div className="p-4 border-t border-white/10">
              <div className="glass rounded-lg p-4 mb-3">
                <p className="text-dark-400 text-sm mb-1">Usuario</p>
                <p className="text-dark-50 font-semibold">{user?.name}</p>
                <p className="text-dark-500 text-xs">{user?.email}</p>
              </div>
              <button
                onClick={handleLogout}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-lg transition-all duration-200"
              >
                <LogOut className="w-5 h-5" />
                <span className="font-medium">Cerrar Sesión</span>
              </button>
            </div>
          </motion.aside>
        </>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-h-screen overflow-hidden">
        {/* Header para mobile */}
        <header className="lg:hidden glass border-b border-white/10 p-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarOpen(true)}
              className="w-10 h-10 flex items-center justify-center glass rounded-lg hover:bg-white/10"
            >
              <Menu className="w-6 h-6 text-dark-300" />
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-600 rounded-lg flex items-center justify-center shadow-lg shadow-primary-500/30">
                <UtensilsCrossed className="w-5 h-5 text-white" />
              </div>
              <span className="font-bold text-dark-50">Comandas</span>
            </div>
            <div className="w-10" /> {/* Spacer for centering */}
          </div>
        </header>

        {/* Main content area */}
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
