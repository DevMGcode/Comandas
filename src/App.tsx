import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { LoginPage } from './presentation/pages/LoginPage';
import { DashboardPage } from './presentation/pages/DashboardPage';
import { TablesPage } from './presentation/pages/TablesPage';
import { KitchenPage } from './presentation/pages/KitchenPage';
import MenuManagementPage from './presentation/pages/MenuManagementPage';
import { Layout } from './presentation/components/layout/Layout';
import { ProtectedRoute } from './presentation/components/auth/ProtectedRoute';

function App() {

  return (
    <BrowserRouter basename="/Comandas">
      <Toaster position="top-right" />
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Layout>
                <Routes>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/tables" element={<TablesPage />} />
                  <Route path="/kitchen" element={<KitchenPage />} />
                  <Route path="/menu" element={<MenuManagementPage />} />
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Routes>
              </Layout>
            </ProtectedRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
