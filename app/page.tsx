import React, { useEffect, useState } from 'react';
import { SEED_USERS } from '../services/mockDb';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole, Country } from '../types';
import { Shield, User, Globe, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogin = (user: typeof SEED_USERS[0]) => {
    login(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-orange-50 flex items-center justify-center p-6 font-sans">
      <div className={`max-w-5xl w-full transition-opacity duration-1000 ease-out ${mounted ? 'opacity-100' : 'opacity-0'}`}>
        
        <div className="text-center mb-16 space-y-4">
          <div className="inline-block mb-2 p-3 bg-brand-100 rounded-2xl text-brand-600 transform transition hover:rotate-12 hover:scale-110 duration-300">
             <Shield size={32} />
          </div>
          <h1 className="text-5xl font-black text-gray-900 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 to-orange-400">Slooze</span>
          </h1>
          <p className="text-gray-500 text-lg max-w-2xl mx-auto leading-relaxed">
            Experience a Role-Based Food Ordering System. Select a persona below to simulate access levels and region-locking.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_USERS.map((user, index) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user)}
              style={{ transitionDelay: `${index * 100}ms` }}
              className={`group relative flex flex-col items-center p-8 bg-white rounded-3xl shadow-lg shadow-gray-100 border border-gray-100 hover:border-brand-200 hover:shadow-2xl hover:shadow-brand-500/10 transition-all duration-500 hover:-translate-y-2 text-left w-full overflow-hidden
                 ${mounted ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}
              `}
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-brand-500 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

              <div className="relative mb-6">
                <div className="w-24 h-24 rounded-full bg-gray-50 ring-4 ring-white shadow-md overflow-hidden relative z-10">
                   <img src={user.avatar} alt={user.name} className="w-full h-full object-cover" />
                </div>
                <div className={`absolute -bottom-1 -right-1 px-3 py-1 rounded-full text-[10px] font-black text-white shadow-sm border-4 border-white z-20 uppercase tracking-widest
                  ${user.role === UserRole.ADMIN ? 'bg-purple-600' : user.role === UserRole.MANAGER ? 'bg-blue-600' : 'bg-gray-500'}`}>
                  {user.role}
                </div>
              </div>

              <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">{user.name}</h3>
              
              <div className="w-full mt-6 space-y-3 text-xs font-bold text-gray-500">
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100">
                  <span className="flex items-center gap-2"><Globe size={14} className="text-gray-400"/> Region</span>
                  <span className={user.country === Country.INDIA ? "text-orange-600" : user.country === Country.AMERICA ? "text-blue-600" : "text-purple-600"}>
                    {user.country}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-3 rounded-xl group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-gray-100">
                  <span className="flex items-center gap-2"><Shield size={14} className="text-gray-400"/> Permissions</span>
                  <span className="text-gray-700">{user.role === UserRole.MEMBER ? 'Restricted' : 'Elevated'}</span>
                </div>
              </div>

              <div className="mt-6 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                 <span className="text-brand-600 text-xs font-bold flex items-center gap-1">
                    Login as {user.name.split(' ')[0]} <ArrowRight size={12} />
                 </span>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-16 text-center">
           <span className="px-4 py-2 rounded-full bg-white border border-gray-200 text-xs font-medium text-gray-400 shadow-sm">
              Simulated Environment • MongoDB Atlas Mock • Next.js App Router Architecture
           </span>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;