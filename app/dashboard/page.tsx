import React, { useEffect, useState, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { getRestaurants } from '../../services/mockDb';
import { Restaurant, UserRole } from '../../types';
import { RestaurantCard } from '../../components/RestaurantCard';
import { Search, Filter, Info, MapPin } from 'lucide-react';
import toast from 'react-hot-toast';

const Dashboard = () => {
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Smart Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [priceFilter, setPriceFilter] = useState<string>('ALL');

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
    addToCart({
      id: crypto.randomUUID(), // Unique ID for the cart item line
      name: `${restaurant.name} Special`,
      price: 15.99,
      quantity: 1,
      restaurantId: restaurant.id
    });
    toast.success(`Added Special from ${restaurant.name}`);
  };

  // Filter Logic
  const filteredRestaurants = useMemo(() => {
    return restaurants.filter(r => {
      const matchesSearch = r.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            r.cuisine.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPrice = priceFilter === 'ALL' || r.priceRange === priceFilter;
      return matchesSearch && matchesPrice;
    });
  }, [restaurants, searchTerm, priceFilter]);

  const RestaurantSkeleton = () => (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden h-80 animate-pulse">
      <div className="h-48 bg-gray-200"></div>
      <div className="p-5 space-y-3">
        <div className="h-6 bg-gray-200 rounded w-3/4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        <div className="flex justify-between pt-4">
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/4"></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header & Filters */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Discover Food</h2>
          <div className="flex items-center gap-2 mt-2 text-sm text-gray-500">
            <MapPin size={16} className="text-brand-500" />
            <span>Region:</span>
            <span className="bg-brand-100 text-brand-800 px-2 py-0.5 rounded font-bold">
              {user?.role === UserRole.ADMIN ? 'ALL REGIONS' : user?.country}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative group">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-brand-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search restaurants or cuisines..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full sm:w-64 pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 transition-all"
            />
          </div>

          {/* Price Filter */}
          <div className="flex bg-white border border-gray-200 rounded-xl p-1">
            {['ALL', '$', '$$', '$$$'].map((price) => (
              <button
                key={price}
                onClick={() => setPriceFilter(price)}
                className={`px-3 py-1.5 rounded-lg text-sm font-bold transition-all ${
                  priceFilter === price 
                    ? 'bg-gray-900 text-white shadow-sm' 
                    : 'text-gray-500 hover:bg-gray-50'
                }`}
              >
                {price === 'ALL' ? 'All' : price}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content Area */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {[1, 2, 3, 4, 5, 6].map(i => <RestaurantSkeleton key={i} />)}
        </div>
      ) : filteredRestaurants.length === 0 ? (
        <div className="text-center py-24 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
          <Filter className="mx-auto h-12 w-12 text-gray-300 mb-3" />
          <h3 className="text-lg font-medium text-gray-900">No restaurants found</h3>
          <p className="text-gray-500">Try adjusting your search or filters.</p>
          <button 
            onClick={() => {setSearchTerm(''); setPriceFilter('ALL');}}
            className="mt-4 text-brand-600 font-bold hover:underline"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredRestaurants.map(repo => (
            <RestaurantCard 
              key={repo.id} 
              restaurant={repo} 
              onSelect={() => handleQuickAdd(repo)}
            />
          ))}
        </div>
      )}
      
      {/* Footer Note */}
      <div className="mt-12 text-center">
         <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full text-xs text-blue-700">
           <Info size={14} />
           <span>Results are locked to your assigned region ({user?.country})</span>
         </div>
      </div>
    </div>
  );
};

export default Dashboard;