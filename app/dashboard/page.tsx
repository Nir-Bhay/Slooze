import React, { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getRestaurants } from '../../services/mockDb';
import { Restaurant, UserRole } from '../../types';
import { RestaurantCard } from '../../components/RestaurantCard';
import { Loader2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchData = async () => {
      try {
        const data = await getRestaurants(user);
        setRestaurants(data);
      } catch (error) {
        toast.error("Failed to fetch restaurants");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user]);

  const handleQuickAdd = (restaurant: Restaurant) => {
    // Simulate adding a generic item from this restaurant
    addToCart({
      id: crypto.randomUUID(),
      name: `${restaurant.name} Special`,
      price: 15.99,
      quantity: 1,
      restaurantId: restaurant.id
    });
    toast.success(`Added from ${restaurant.name}`);
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="animate-spin mb-2" size={32} />
        <p>Loading Restaurants for {user?.country}...</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Restaurants</h2>
          <p className="text-gray-500 flex items-center gap-2 mt-1">
            Showing results for: 
            <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded font-bold text-sm">
              {user?.role === UserRole.ADMIN ? 'ALL REGIONS (Admin Access)' : user?.country}
            </span>
          </p>
        </div>
        
        <div className="bg-blue-50 border border-blue-100 p-3 rounded-lg flex items-start gap-3 max-w-md text-sm text-blue-800">
          <Info className="shrink-0 mt-0.5" size={16} />
          <p>Region Lock Active: You are seeing restaurants available in your designated region based on your profile settings.</p>
        </div>
      </div>

      {restaurants.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
          <p className="text-gray-500">No restaurants found for this region.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {restaurants.map(repo => (
            <RestaurantCard 
              key={repo.id} 
              restaurant={repo} 
              onSelect={() => handleQuickAdd(repo)}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;