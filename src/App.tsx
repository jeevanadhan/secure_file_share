import React, { useEffect, useState } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { Auth } from './components/Auth';
import { Layout } from './components/Layout';
import { Home } from './pages/Home';
import { About } from './pages/About';
import { Upload } from './pages/Upload';
import { Share } from './pages/Share';
import { Download } from './pages/Download';
import { supabase } from './lib/supabase';
import { Toaster } from 'react-hot-toast';
import { Session } from '@supabase/supabase-js'; // Import Session type

function App() {
  const [session, setSession] = useState<Session | null>(null);
  const location = useLocation();

  useEffect(() => {
    const fetchSession = async () => {
      const { data, error } = await supabase.auth.getSession();
      if (error) {
        console.error('Error fetching session:', error);
        return;
      }
      setSession(data?.session || null); // Ensure it sets null if no session exists
    };

    fetchSession();

    const {
      data: authListener
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession); // Directly update session when auth state changes
    });

    return () => {
      authListener?.subscription?.unsubscribe(); // Ensure safe cleanup
    };
  }, []);

  if (!session && location.pathname !== '/download') {
    return (
      <div 
        className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&q=80')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>
        <Auth />
        <Toaster position="top-right" />
      </div>
    );
  }

  return (
    <>
      <Routes>
        <Route path="/download/:shareId" element={<Download />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/share" element={<Share />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
      <Toaster position="top-right" />
    </>
  );
}

export default App;
