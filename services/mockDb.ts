import { User, UserRole, Country, Restaurant, Order, OrderStatus } from '../types';

// --- SEED DATA ---

export const SEED_USERS: User[] = [
  { id: 'u1', name: 'Nick Fury', role: UserRole.ADMIN, country: Country.ALL, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Nick' },
  { id: 'u2', name: 'Captain Marvel', role: UserRole.MANAGER, country: Country.INDIA, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marvel' },
  { id: 'u3', name: 'Captain America', role: UserRole.MANAGER, country: Country.AMERICA, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=America' },
  { id: 'u4', name: 'Thanos', role: UserRole.MEMBER, country: Country.INDIA, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thanos' },
  { id: 'u5', name: 'Thor', role: UserRole.MEMBER, country: Country.INDIA, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Thor' },
  { id: 'u6', name: 'Travis', role: UserRole.MEMBER, country: Country.AMERICA, avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Travis' },
];

export const SEED_RESTAURANTS: Restaurant[] = [
  // INDIA
  { id: 'r1', name: 'Spicy Tandoor', country: Country.INDIA, cuisine: 'North Indian', image: 'https://picsum.photos/id/42/400/300', rating: 4.5, deliveryTime: '30-40 min', priceRange: '$$' },
  { id: 'r2', name: 'Mumbai Chaat House', country: Country.INDIA, cuisine: 'Street Food', image: 'https://picsum.photos/id/493/400/300', rating: 4.2, deliveryTime: '20-30 min', priceRange: '$' },
  { id: 'r3', name: 'South Dravida', country: Country.INDIA, cuisine: 'South Indian', image: 'https://picsum.photos/id/225/400/300', rating: 4.8, deliveryTime: '35-45 min', priceRange: '$$$' },
  // AMERICA
  { id: 'r4', name: 'Brooklyn Burgers', country: Country.AMERICA, cuisine: 'American', image: 'https://picsum.photos/id/163/400/300', rating: 4.6, deliveryTime: '25-35 min', priceRange: '$$' },
  { id: 'r5', name: 'Texas BBQ Pit', country: Country.AMERICA, cuisine: 'BBQ', image: 'https://picsum.photos/id/292/400/300', rating: 4.7, deliveryTime: '40-50 min', priceRange: '$$$' },
  { id: 'r6', name: 'NY Pizza Slice', country: Country.AMERICA, cuisine: 'Italian-American', image: 'https://picsum.photos/id/312/400/300', rating: 4.3, deliveryTime: '20-30 min', priceRange: '$' },
];

// --- MOCK DATABASE STATE ---
let orders: Order[] = [
  { id: 'o1', userId: 'u1', restaurantName: 'Brooklyn Burgers', items: '2x Cheese Burger', total: 35.00, status: OrderStatus.COMPLETED, createdAt: new Date().toISOString() },
];

// --- API SIMULATION ---

export const getRestaurants = async (user: User): Promise<Restaurant[]> => {
  // Region Lock Logic
  await new Promise(r => setTimeout(r, 500)); // Simulate network lag

  if (user.role === UserRole.ADMIN) {
    return SEED_RESTAURANTS;
  }

  if (user.country === Country.INDIA) {
    return SEED_RESTAURANTS.filter(r => r.country === Country.INDIA);
  }

  if (user.country === Country.AMERICA) {
    return SEED_RESTAURANTS.filter(r => r.country === Country.AMERICA);
  }

  return [];
};

export const placeOrder = async (user: User, cartItems: any[], total: number): Promise<Order> => {
  await new Promise(r => setTimeout(r, 800));

  // STRICT RBAC CHECK (Server Side Simulation)
  if (user.role === UserRole.MEMBER) {
    throw new Error("403 FORBIDDEN: Members cannot process payments.");
  }

  const newOrder: Order = {
    id: `o${orders.length + 1}`,
    userId: user.id,
    restaurantName: 'Slooze Kitchen', // Simplified
    items: `${cartItems.length} items`,
    total: total,
    status: OrderStatus.PENDING,
    createdAt: new Date().toISOString(),
  };

  orders.push(newOrder);
  return newOrder;
};

export const getOrders = async (user: User): Promise<Order[]> => {
  await new Promise(r => setTimeout(r, 400));
  // Everyone can see their own orders. Admins see all.
  // For this demo, let's show all orders if Admin, otherwise own orders.
  if (user.role === UserRole.ADMIN) return orders;
  return orders.filter(o => o.userId === user.id);
};

export const cancelOrder = async (user: User, orderId: string): Promise<void> => {
  await new Promise(r => setTimeout(r, 600));

  // STRICT RBAC CHECK
  if (user.role === UserRole.MEMBER) {
    throw new Error("403 FORBIDDEN: Members cannot cancel orders.");
  }

  const orderIndex = orders.findIndex(o => o.id === orderId);
  if (orderIndex > -1) {
    orders[orderIndex].status = OrderStatus.CANCELLED;
  }
};
