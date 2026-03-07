import React from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import AppRoutes from './routes/AppRoutes';
import { supabase } from './lib/supabaseClient';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'sonner';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="flex flex-col min-h-screen">
          <Navbar />
          <main className="flex-grow">
            <AppRoutes />
          </main>
          <Footer />
          <Toaster position="top-center" richColors />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
