import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { CreditCard, ShieldAlert } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useAuth();

  if (!user) return null;

  if (user.role !== UserRole.ADMIN) {
      return (
          <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 text-center">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                  <ShieldAlert className="text-red-500" size={48} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
              <p className="text-gray-500 max-w-md">You do not have permission to view the Payment Settings page. Only <strong>ADMIN</strong> roles can access this area.</p>
          </div>
      )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
       <h1 className="text-2xl font-bold text-gray-900 mb-6">Payment Settings</h1>
       
       <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
           <div className="p-6 border-b border-gray-100">
               <h3 className="font-bold text-lg mb-1">Payment Methods</h3>
               <p className="text-sm text-gray-500">Manage accepted payment gateways for the platform.</p>
           </div>
           
           <div className="p-6 space-y-4">
               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100">
                   <div className="flex items-center gap-3">
                       <CreditCard className="text-brand-600" />
                       <div>
                           <p className="font-bold text-sm">Stripe Connect</p>
                           <p className="text-xs text-gray-500">Credit/Debit Cards</p>
                       </div>
                   </div>
                   <div className="flex items-center gap-2">
                       <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                       <span className="text-sm font-medium text-gray-700">Active</span>
                   </div>
               </div>

               <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-100 opacity-60">
                   <div className="flex items-center gap-3">
                       <div className="w-6 h-6 rounded bg-blue-600 text-white flex items-center justify-center font-bold text-xs">P</div>
                       <div>
                           <p className="font-bold text-sm">PayPal</p>
                           <p className="text-xs text-gray-500">Wallet</p>
                       </div>
                   </div>
                    <button className="text-brand-600 text-sm font-bold hover:underline">Connect</button>
               </div>
           </div>
           <div className="bg-gray-50 p-4 text-center text-xs text-gray-400">
               Admin privileges validated.
           </div>
       </div>
    </div>
  );
};

export default SettingsPage;