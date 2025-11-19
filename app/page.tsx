import React from 'react';
import { SEED_USERS } from '../services/mockDb';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { UserRole, Country } from '../types';
import { Shield, User, Globe } from 'lucide-react';

const LoginPage = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (user: typeof SEED_USERS[0]) => {
    login(user);
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 flex items-center justify-center p-6">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
            Welcome to <span className="text-brand-500">Slooze</span>
          </h1>
          <p className="text-gray-500 text-lg">Select a persona to simulate the Role-Based experience</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SEED_USERS.map((user) => (
            <button
              key={user.id}
              onClick={() => handleLogin(user)}
              className="group relative flex flex-col items-center p-8 bg-white rounded-2xl shadow-sm hover:shadow-xl border border-gray-100 hover:border-brand-200 transition-all duration-300 hover:-translate-y-1 text-left w-full"
            >
              <div className="relative mb-4">
                <img src={user.avatar} alt={user.name} className="w-20 h-20 rounded-full bg-gray-50 ring-4 ring-white shadow-sm" />
                <div className={`absolute -bottom-2 -right-2 px-2 py-1 rounded-full text-[10px] font-bold text-white shadow-sm border-2 border-white
                  ${user.role === UserRole.ADMIN ? 'bg-purple-600' : user.role === UserRole.MANAGER ? 'bg-blue-600' : 'bg-gray-500'}`}>
                  {user.role}
                </div>
              </div>

              <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-brand-600 transition-colors">{user.name}</h3>
              
              <div className="w-full mt-4 space-y-2 text-xs font-medium text-gray-500">
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span className="flex items-center gap-2"><Globe size={14}/> Country</span>
                  <span className={user.country === Country.INDIA ? "text-orange-600" : user.country === Country.AMERICA ? "text-blue-600" : "text-purple-600"}>
                    {user.country}
                  </span>
                </div>
                <div className="flex items-center justify-between bg-gray-50 p-2 rounded-lg">
                  <span className="flex items-center gap-2"><Shield size={14}/> Access</span>
                  <span>{user.role === UserRole.MEMBER ? 'Limited' : 'Full'}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
        
        <div className="mt-12 text-center text-xs text-gray-400 max-w-lg mx-auto">
          <p>Mock Environment: connecting to MongoDb Atlas via simulated interface.</p>
          <p>Authentication is simulated using React Context.</p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;