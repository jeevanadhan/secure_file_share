import React from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { Shield, LogOut, Home, Upload, Share, Info } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function Layout() {
  const navigate = useNavigate();
  const user = supabase.auth.getUser();

  const navItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/upload', icon: Upload, label: 'Upload' },
    { to: '/share', icon: Share, label: 'Share' },
    { to: '/about', icon: Info, label: 'About' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="max-w-6xl mx-auto p-4">
        <header className="flex items-center justify-between pt-4 mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 rounded-lg">
              <Shield className="h-6 w-6 text-blue-500" />
            </div>
            <h1 className="text-2xl font-bold text-white">Secure File Sharing</h1>
          </div>
          <nav className="flex items-center gap-6">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                    isActive
                      ? 'text-blue-400 bg-blue-400/10'
                      : 'text-gray-400 hover:text-gray-300 hover:bg-gray-700/50'
                  }`
                }
              >
                <Icon className="h-4 w-4" />
                {label}
              </NavLink>
            ))}
            <button
              onClick={() => {
                supabase.auth.signOut();
                navigate('/');
              }}
              className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-400 bg-red-400/10 rounded-lg hover:bg-red-400/20 transition-colors"
            >
              <LogOut className="h-4 w-4" />
              Sign Out
            </button>
          </nav>
        </header>
        
        <main>
          <Outlet />
        </main>
      </div>
    </div>
  );
}