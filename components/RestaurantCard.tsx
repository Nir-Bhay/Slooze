import React from 'react';
import { Restaurant, Country } from '../types';
import { Star, Clock, MapPin, DollarSign } from 'lucide-react';

interface Props {
  restaurant: Restaurant;
  onSelect: () => void;
}

export const RestaurantCard: React.FC<Props> = ({ restaurant, onSelect }) => {
  return (
    <div 
      onClick={onSelect}
      className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden">
        <img 
          src={restaurant.image} 
          alt={restaurant.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-lg text-xs font-bold shadow-sm text-gray-800 flex items-center gap-1">
          <Clock size={12} className="text-brand-500" />
          {restaurant.deliveryTime}
        </div>
        {restaurant.country === Country.INDIA ? (
           <div className="absolute bottom-3 left-3 bg-orange-100 text-orange-800 px-2 py-1 rounded text-[10px] font-bold tracking-wide border border-orange-200">
             INDIA
           </div>
        ) : (
          <div className="absolute bottom-3 left-3 bg-blue-100 text-blue-800 px-2 py-1 rounded text-[10px] font-bold tracking-wide border border-blue-200">
             AMERICA
           </div>
        )}
      </div>
      
      <div className="p-5">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-gray-900 leading-tight group-hover:text-brand-600 transition-colors">
            {restaurant.name}
          </h3>
          <div className="flex items-center gap-1 bg-green-50 px-1.5 py-0.5 rounded text-green-700 text-xs font-bold">
            {restaurant.rating}
            <Star size={10} className="fill-current" />
          </div>
        </div>
        
        <p className="text-gray-500 text-sm mb-4">{restaurant.cuisine}</p>
        
        <div className="flex items-center justify-between text-xs text-gray-400 font-medium border-t border-gray-50 pt-4">
          <span className="flex items-center gap-1">
             <MapPin size={12} />
             {restaurant.country}
          </span>
           <span className="flex items-center gap-1 text-gray-600">
             <DollarSign size={12} />
             {restaurant.priceRange}
          </span>
        </div>
      </div>
    </div>
  );
};