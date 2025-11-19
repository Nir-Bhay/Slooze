import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrder } from '../../services/mockDb';
import { UserRole } from '../../types';
import { Trash2, ArrowRight, Lock, AlertTriangle, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { items, removeFromCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const canPay = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

  const handleCheckout = async () => {
    if (!user) return;
    
    // Double check RBAC logic (although button is disabled)
    if (!canPay) {
      toast.error("Permission Denied: Members cannot process payments.");
      return;
    }

    setProcessing(true);
    try {
      await placeOrder(user, items, total);
      toast.success("Order placed successfully!");
      clearCart();
      navigate('/orders');
    } catch (error: any) {
      // Capture the error message from the API service (403 Forbidden)
      toast.error(error.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <ArrowRight className="text-gray-400" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-3 bg-brand-500 text-white rounded-xl font-semibold hover:bg-brand-600 transition"
        >
          Start Ordering
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center font-bold text-gray-400">
                  {item.quantity}x
                </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)}</p>
                </div>
              </div>
              <button 
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4">Order Summary</h3>
            <div className="space-y-2 mb-4 pb-4 border-b border-gray-100">
              <div className="flex justify-between text-gray-500">
                <span>Subtotal</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500">
                <span>Delivery Fee</span>
                <span>$2.00</span>
              </div>
            </div>
            <div className="flex justify-between text-xl font-bold text-gray-900 mb-6">
              <span>Total</span>
              <span>${(total + 2).toFixed(2)}</span>
            </div>

            {/* RBAC CHECKOUT BUTTON */}
            <div className="relative">
              <button
                onClick={handleCheckout}
                disabled={!canPay || processing}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all
                  ${canPay 
                    ? 'bg-brand-500 hover:bg-brand-600 text-white shadow-lg shadow-brand-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
              >
                {processing ? 'Processing...' : canPay ? 'Pay Now' : 'Payment Disabled'}
                {canPay ? <ArrowRight size={18} /> : <Lock size={16} />}
              </button>

              {!canPay && (
                <div className="mt-3 bg-amber-50 border border-amber-100 rounded-lg p-3 flex items-start gap-2 text-xs text-amber-800">
                  <AlertTriangle className="shrink-0 mt-0.5 text-amber-600" size={14} />
                  <p>
                    <strong>Permission Denied:</strong> As a <strong>{user?.role}</strong>, you are not authorized to process final payments. Please contact a Manager or Admin.
                  </p>
                </div>
              )}
              
              {canPay && (
                 <div className="mt-3 flex items-center justify-center gap-1 text-xs text-green-600">
                    <CheckCircle size={12} />
                    <span>Authorized as {user?.role}</span>
                 </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;