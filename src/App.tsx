import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import { Exams } from './pages/Exams';
import { Login } from './pages/Login';
import { Tules } from './pages/Tules';
import { Theory } from './pages/Theory';
import { Account } from './pages/Account';
import { MainLayout } from './pages/MainLayout';
import { InstallPWA } from './components/InstallPWA';
import { TulManagement } from './pages/TulManagement';
import { ExamDetail } from './pages/ExamDetail';
import { ProgressProvider } from './context/ProgressContext';

function App() {
  const [isLogged, setIsLogged] = useState(() => {
    const saved = localStorage.getItem('isLogged');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLogged', isLogged.toString());
  }, [isLogged]);

  const handleLoginSuccess = () => {
    setIsLogged(true);
  };

  const handleLogout = () => {
    setIsLogged(false);
    localStorage.removeItem('isLogged');
  };

  const appContent = isLogged ? (
    <ProgressProvider>
      <BrowserRouter>
        <Routes>
          <Route element={<MainLayout onLogout={handleLogout} />}>
            <Route path="/" element={<Exams />} />
            <Route path="/exam/:examId" element={<ExamDetail />} />
            <Route path="/tul/:tulId" element={<TulManagement />} />
            <Route path="/tules" element={<Tules />} />
            <Route path="/theory" element={<Theory />} />
            <Route path="/account" element={<Account />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </ProgressProvider>
  ) : (
    <Login onLoginSuccess={handleLoginSuccess} />
  );

  return (
    <>
      <InstallPWA />
      {appContent}
    </>
  );
}

export default App;
