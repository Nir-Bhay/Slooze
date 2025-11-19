export enum UserRole {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER',
  MEMBER = 'MEMBER',
}

export enum Country {
  INDIA = 'INDIA',
  AMERICA = 'AMERICA',
  ALL = 'ALL',
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  country: Country;
  avatar: string;
}

export interface Restaurant {
  id: string;
  name: string;
  country: Country;
  cuisine: string;
  image: string;
  rating: number;
  deliveryTime: string;
  priceRange: string;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  restaurantId: string;
  quantity: number;
}

export enum OrderStatus {
  PENDING = 'Pending',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export interface Order {
  id: string;
  userId: string;
  restaurantName: string;
  items: string; // Simplified for summary
  total: number;
  status: OrderStatus;
  createdAt: string;
}