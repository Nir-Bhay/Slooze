import React, { useState } from 'react';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { placeOrder } from '../../services/mockDb';
import { UserRole } from '../../types';
import { Trash2, ArrowRight, Lock, AlertTriangle, CheckCircle, Minus, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { items, removeFromCart, decreaseQuantity, addToCart, total, clearCart } = useCart();
  const { user } = useAuth();
  const [processing, setProcessing] = useState(false);
  const navigate = useNavigate();

  const canPay = user?.role === UserRole.ADMIN || user?.role === UserRole.MANAGER;

  const handleCheckout = async () => {
    if (!user) return;
    
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
      toast.error(error.message || "Failed to place order");
    } finally {
      setProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="w-24 h-24 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-pulse">
          <ArrowRight className="text-gray-300" size={32} />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Discover great food in your region to get started.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-8 py-3 bg-gray-900 text-white rounded-xl font-semibold hover:bg-brand-600 transition shadow-lg hover:shadow-xl"
        >
          Browse Restaurants
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items List */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex flex-col sm:flex-row items-center justify-between bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                 <div className="hidden sm:block w-16 h-16 bg-gray-100 rounded-xl overflow-hidden">
                    <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-400">
                        <span className="text-xs font-bold">IMG</span>
                    </div>
                 </div>
                <div>
                  <h3 className="font-bold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-500">${item.price.toFixed(2)} / unit</p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-4 sm:mt-0 w-full sm:w-auto justify-between sm:justify-end">
                {/* Quantity Controls */}
                <div className="flex items-center gap-3 bg-gray-50 rounded-lg p-1">
                  <button 
                    onClick={() => decreaseQuantity(item.id)}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand-600 transition"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="w-4 text-center font-bold text-sm">{item.quantity}</span>
                  <button 
                    onClick={() => addToCart(item)}
                    className="w-8 h-8 flex items-center justify-center bg-white rounded shadow-sm text-gray-600 hover:text-brand-600 transition"
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <div className="font-bold text-gray-900 w-20 text-right">
                    ${(item.price * item.quantity).toFixed(2)}
                </div>

                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                  title="Remove Item"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Checkout Summary & RBAC Panel */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h3 className="font-bold text-gray-900 mb-6 text-lg">Order Summary</h3>
            
            <div className="space-y-3 mb-6 pb-6 border-b border-gray-100">
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Subtotal ({items.reduce((a,c) => a + c.quantity, 0)} items)</span>
                <span>${total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Delivery Fee</span>
                <span>$2.00</span>
              </div>
              <div className="flex justify-between text-gray-500 text-sm">
                <span>Tax (Est.)</span>
                <span>${(total * 0.08).toFixed(2)}</span>
              </div>
            </div>

            <div className="flex justify-between items-end mb-8">
              <span className="text-gray-900 font-bold text-lg">Total</span>
              <div className="text-right">
                 <span className="text-2xl font-black text-brand-600">${(total + 2 + (total*0.08)).toFixed(2)}</span>
                 <p className="text-[10px] text-gray-400">USD</p>
              </div>
            </div>

            {/* RBAC CHECKOUT BUTTON */}
            <div className="relative">
              <button
                onClick={handleCheckout}
                disabled={!canPay || processing}
                className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-3 transition-all duration-300 group
                  ${canPay 
                    ? 'bg-gray-900 hover:bg-brand-600 text-white shadow-lg hover:shadow-brand-200' 
                    : 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200'
                  }`}
              >
                {processing ? (
                   <span className="animate-pulse">Processing...</span>
                ) : canPay ? (
                   <>Checkout <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform"/></>
                ) : (
                   <>Payment Disabled <Lock size={16} /></>
                )}
              </button>

              {!canPay && (
                <div className="mt-4 bg-red-50 border border-red-100 rounded-xl p-4 flex items-start gap-3 text-xs text-red-800">
                  <div className="bg-red-100 p-1.5 rounded-full shrink-0">
                     <AlertTriangle className="text-red-600" size={14} />
                  </div>
                  <div>
                    <p className="font-bold mb-1">Restricted Access</p>
                    <p className="opacity-90 leading-relaxed">
                      As a <strong>{user?.role}</strong>, you are not authorized to finalize transactions. Please request a Manager or Admin to complete this order.
                    </p>
                  </div>
                </div>
              )}
              
              {canPay && (
                 <div className="mt-4 flex items-center justify-center gap-2 text-xs text-green-600 bg-green-50 py-2 rounded-lg border border-green-100">
                    <CheckCircle size={14} />
                    <span className="font-medium">Authorized as {user?.role}</span>
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