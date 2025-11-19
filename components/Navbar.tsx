import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingBag, LogOut, Settings, ListChecks, MapPin, Shield, User as UserIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link to="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            <div className="bg-brand-500 p-1.5 rounded-lg">
              <ShoppingBag className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-brand-600 to-brand-500 bg-clip-text text-transparent">
              Slooze
            </span>
          </Link>

          <div className="flex items-center gap-6">
            {/* User Metadata Badge */}
            <div className="hidden md:flex items-center gap-3 bg-gray-50 px-3 py-1.5 rounded-full border border-gray-100">
              <div className="flex flex-col items-end">
                <span className="text-xs font-bold text-gray-900 leading-none">{user.name}</span>
                <div className="flex gap-2 mt-0.5">
                  <span className="text-[10px] uppercase tracking-wider font-medium text-brand-600 flex items-center gap-1">
                    <Shield size={10} /> {user.role}
                  </span>
                  <span className="text-[10px] uppercase tracking-wider font-medium text-gray-500 flex items-center gap-1">
                    <MapPin size={10} /> {user.country}
                  </span>
                </div>
              </div>
              <img src={user.avatar} alt={user.name} className="h-8 w-8 rounded-full bg-white shadow-sm" />
            </div>

            <div className="flex items-center gap-2">
              <Link to="/orders" className="p-2 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition" title="My Orders">
                <ListChecks size={20} />
              </Link>

              {user.role === UserRole.ADMIN && (
                <Link to="/settings" className="p-2 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition" title="Settings">
                  <Settings size={20} />
                </Link>
              )}

              <Link to="/cart" className="relative p-2 text-gray-600 hover:text-brand-600 hover:bg-brand-50 rounded-full transition">
                <ShoppingBag size={20} />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white transform translate-x-1/4 -translate-y-1/4 bg-brand-500 rounded-full">
                    {items.length}
                  </span>
                )}
              </Link>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              <button onClick={handleLogout} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition" title="Logout">
                <LogOut size={20} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};