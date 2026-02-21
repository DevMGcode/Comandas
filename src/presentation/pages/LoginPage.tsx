import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChefHat, Users, Shield, Lock, User as UserIcon } from 'lucide-react';
import { useAuthStore } from '../stores/auth.store';
import { UserRole } from '@domain/types';
import { Button } from '../components/ui/Button';
import { notificationService } from '@infrastructure/services/notification.service';

export const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const login = useAuthStore(state => state.login);

  const handleLogin = () => {
    if (!username || !password) {
      notificationService.warning('Por favor completa todos los campos');
      return;
    }

    // Validación simple de credenciales
    const credentials: Record<string, { password: string; role: UserRole; email: string; name: string }> = {
      admin: { password: 'admin', role: UserRole.ADMIN, email: 'admin@comandas.com', name: 'Administrador' },
      mesero: { password: 'mesero', role: UserRole.WAITER, email: 'mesero@comandas.com', name: 'Mesero' },
      chef: { password: 'chef', role: UserRole.CHEF, email: 'chef@comandas.com', name: 'Chef' },
    };

    const user = credentials[username.toLowerCase()];

    if (!user || user.password !== password) {
      notificationService.error('Usuario o contraseña incorrectos');
      return;
    }

    login(user.email, user.role, user.name);
    notificationService.success(`¡Bienvenido, ${user.name}!`);
    navigate('/dashboard');
  };

  const handleQuickLogin = (username: string) => {
    setUsername(username);
    setPassword(username);
  };

  const roles = [
    { value: 'admin', label: 'Administrador', icon: Shield, color: 'from-purple-500 to-purple-600' },
    { value: 'mesero', label: 'Mesero', icon: Users, color: 'from-blue-500 to-blue-600' },
    { value: 'chef', label: 'Chef', icon: ChefHat, color: 'from-orange-500 to-orange-600' },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-dark-900 via-dark-950 to-black"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(14,165,233,0.1),transparent_50%)]"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-md"
      >
        <div className="card">
          {/* Logo y título */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: 'spring' }}
              className="inline-block mb-4"
            >
              <div className="w-20 h-20 mx-auto bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center shadow-lg shadow-primary-500/50">
                <ChefHat className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h1 className="text-3xl font-bold glow-text mb-2">Comandas Restaurant</h1>
            <p className="text-dark-400">Sistema de Gestión Inteligente</p>
          </div>

          {/* Usuario input */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Usuario
            </label>
            <div className="relative">
              <UserIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="text"
                placeholder="admin, mesero o chef"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Contraseña input */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Contraseña
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-dark-400" />
              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="input pl-10"
              />
            </div>
          </div>

          {/* Login button */}
          <Button
            variant="primary"
            size="lg"
            onClick={handleLogin}
            className="w-full mb-6"
          >
            Iniciar Sesión
          </Button>

          {/* Quick access buttons */}
          <div className="mb-4">
            <p className="text-xs text-dark-400 text-center mb-3">Acceso rápido</p>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((role) => {
                const Icon = role.icon;
                return (
                  <motion.button
                    key={role.value}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleQuickLogin(role.value)}
                    className="p-3 rounded-lg glass glass-hover flex flex-col items-center gap-2"
                  >
                    <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                      <Icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-xs font-medium text-dark-200">{role.label}</span>
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-6"
        >
          <div className="glass rounded-lg p-4 mb-4">
            <p className="text-dark-300 text-xs mb-2 font-semibold">Credenciales de acceso:</p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div>
                <p className="text-purple-400">👤 admin</p>
                <p className="text-dark-500">🔑 admin</p>
              </div>
              <div>
                <p className="text-blue-400">👤 mesero</p>
                <p className="text-dark-500">🔑 mesero</p>
              </div>
              <div>
                <p className="text-orange-400">👤 chef</p>
                <p className="text-dark-500">🔑 chef</p>
              </div>
            </div>
          </div>
          <p className="text-dark-500 text-sm">
            Sistema con arquitectura hexagonal · React + TypeScript
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
