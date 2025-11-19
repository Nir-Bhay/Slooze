import React from 'react';
import { Restaurant, Country } from '../types';
import { Star, Clock, MapPin, Plus } from 'lucide-react';

interface Props {
  restaurant: Restaurant;
  onSelect: () => void;
}

export const RestaurantCard: React.FC<Props> = ({ restaurant, onSelect }) => {
  return (
    <div className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col h-full">
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-60"></div>
        
        <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm px-2.5 py-1 rounded-lg text-xs font-bold shadow-sm text-gray-800 flex items-center gap-1.5">
          <Clock size={12} className="text-brand-500" />
          {restaurant.deliveryTime}
        </div>
        
        <div className="absolute bottom-3 left-3 text-white">
           <span className={`text-[10px] font-bold px-2 py-0.5 rounded border border-white/20 uppercase tracking-wider
             ${restaurant.country === Country.INDIA ? 'bg-orange-500/80' : 'bg-blue-500/80'}`}>
             {restaurant.country}
           </span>
        </div>
      </div>
      
      {/* Info Section */}
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-green-700 text-xs font-bold border border-green-100">
            {restaurant.rating}
            <Star size={10} className="fill-current" />
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-4 flex-1">{restaurant.cuisine}</p>
        
        <div className="flex items-center justify-between pt-4 border-t border-gray-50 mt-auto">
          <div className="flex flex-col text-xs">
            <span className="text-gray-400 mb-0.5">Details</span>
            <div className="flex items-center gap-2 font-medium text-gray-600">
               <span>{restaurant.priceRange}</span>
               <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
               <span className="flex items-center gap-0.5">
                 <MapPin size={10} /> Local
               </span>
            </div>
          </div>
          
          <button 
            onClick={(e) => {
               e.stopPropagation();
               onSelect();
            }}
            className="bg-gray-900 hover:bg-brand-600 text-white p-2.5 rounded-xl transition-colors shadow-lg shadow-gray-200 hover:shadow-brand-200 group/btn"
            title="Quick Add Special"
          >
            <Plus size={18} className="group-hover/btn:scale-110 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};