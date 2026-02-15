import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AuthScreen } from './components/AuthScreen';
import { MainApp } from './components/MainApp';
import { ThemeProvider } from './contexts/ThemeContext';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<{ id: string; name: string; email: string } | null>(null);

  const handleAuthSuccess = (userData: { id: string; name: string; email: string }) => {
    setUser(userData);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  return (
    <ThemeProvider>
      <div className="size-full">
        <AnimatePresence mode="wait">
          {!isAuthenticated ? (
            <AuthScreen key="auth" onAuthSuccess={handleAuthSuccess} />
          ) : (
            <MainApp key="main" user={user!} onLogout={handleLogout} />
          )}
        </AnimatePresence>
      </div>
    </ThemeProvider>
  );
}