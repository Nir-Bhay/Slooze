import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getOrders, cancelOrder } from '../../services/mockDb';
import { Order, OrderStatus, UserRole } from '../../types';
import { Clock, XCircle, Search } from 'lucide-react';
import toast from 'react-hot-toast';

const OrdersPage = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
     if (!user) return;
     setLoading(true);
     try {
       const data = await getOrders(user);
       setOrders(data);
     } finally {
       setLoading(false);
     }
  };

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const handleCancel = async (orderId: string) => {
    if (!user) return;
    
    // Explicit RBAC Check
    if (user.role === UserRole.MEMBER) {
        toast.error("Permission Denied: Members cannot cancel orders");
        return;
    }

    try {
      await cancelOrder(user, orderId);
      toast.success("Order cancelled");
      fetchOrders(); // Refresh
    } catch (e: any) {
      toast.error(e.message);
    }
  };

  if (loading) return <div className="p-8 text-center">Loading orders...</div>;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Order History</h1>
      
      {orders.length === 0 ? (
          <div className="bg-gray-50 rounded-xl p-8 text-center">No orders found.</div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-6 flex flex-col md:flex-row items-center justify-between gap-4 shadow-sm hover:shadow-md transition">
               <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                      <h3 className="font-bold text-lg text-gray-900">{order.restaurantName}</h3>
                      <span className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-full border
                        ${order.status === OrderStatus.COMPLETED ? 'bg-green-50 text-green-700 border-green-100' : 
                          order.status === OrderStatus.CANCELLED ? 'bg-red-50 text-red-700 border-red-100' : 
                          'bg-yellow-50 text-yellow-700 border-yellow-100'}`}>
                        {order.status}
                      </span>
                  </div>
                  <p className="text-gray-500 text-sm mb-2">{order.items}</p>
                  <div className="flex items-center gap-4 text-xs text-gray-400">
                      <span className="flex items-center gap-1"><Clock size={12}/> {new Date(order.createdAt).toLocaleDateString()}</span>
                      <span>Total: ${order.total.toFixed(2)}</span>
                  </div>
               </div>

               {order.status === OrderStatus.PENDING && (
                   user?.role !== UserRole.MEMBER ? (
                       <button 
                         onClick={() => handleCancel(order.id)}
                         className="px-4 py-2 bg-white border border-red-200 text-red-600 text-sm font-semibold rounded-lg hover:bg-red-50 transition flex items-center gap-2"
                       >
                         <XCircle size={16} /> Cancel Order
                       </button>
                   ) : (
                       <div title="Only Managers/Admins can cancel" className="opacity-50 px-4 py-2 border border-gray-200 text-gray-400 text-sm font-semibold rounded-lg cursor-not-allowed flex items-center gap-2">
                           <XCircle size={16} /> Cancel
                       </div>
                   )
               )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrdersPage;