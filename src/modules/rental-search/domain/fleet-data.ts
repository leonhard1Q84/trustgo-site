export interface FleetVehicle {
  id: string;
  name: string;
  category: string;
  acrissCode: string; // e.g. IFAR, CDAR, MVAR, ECAR
  badge: string;
  seats: number;
  bags: number;
  doors: number;
  gear: 'Automatic' | 'Manual';
  fuel: 'Petrol' | 'Hybrid' | 'Diesel' | 'Electric' | 'Petrol / Hybrid' | 'Diesel / Petrol';
  rating: number;
  reviewsCount: number;
  pricePerDay: number;
  currency: string;
  image: string;
  supplier: {
    name: string;
    logo?: string;
    locationType: 'In-Terminal Counter' | 'Free Shuttle Bus' | 'Meet & Greet';
    rating: number;
  };
  features: string[];
  depositAmount: number; // 0 = deposit-free
  mileagePolicy: 'Unlimited Mileage' | 'Limited (250 km/day)';
  fuelPolicy: 'Like for Like (Full to Full)' | 'Pre-purchase';
  cancellationFreeHours: number; // e.g. 48 hours before pickup; 0 = non-refundable
}

export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'toyota-rav4-suv',
    name: 'Toyota RAV4 AWD or similar',
    category: 'Intermediate SUV',
    acrissCode: 'IFAR',
    badge: 'Most Popular',
    seats: 5,
    bags: 3,
    doors: 5,
    gear: 'Automatic',
    fuel: 'Petrol / Hybrid',
    rating: 4.9,
    reviewsCount: 320,
    pricePerDay: 58,
    currency: '$',
    image: '/images/vehicles/compact-suv.jpg',
    supplier: {
      name: 'TrustGo Prime Hub',
      locationType: 'In-Terminal Counter',
      rating: 4.9,
    },
    features: [
      'Unlimited Mileage',
      'Touchless Express Pickup',
      'Apple CarPlay / Android Auto',
      'All-Wheel Drive (AWD)',
    ],
    depositAmount: 300,
    mileagePolicy: 'Unlimited Mileage',
    fuelPolicy: 'Like for Like (Full to Full)',
    cancellationFreeHours: 48,
  },
  {
    id: 'hyundai-i30-compact',
    name: 'Hyundai i30 or similar',
    category: 'Compact Hatchback',
    acrissCode: 'CDAR',
    badge: 'Best Value',
    seats: 5,
    bags: 2,
    doors: 5,
    gear: 'Automatic',
    fuel: 'Petrol',
    rating: 4.8,
    reviewsCount: 245,
    pricePerDay: 42,
    currency: '$',
    image: '/images/vehicles/compact-hatchback.jpg',
    supplier: {
      name: 'TrustGo City Station',
      locationType: 'In-Terminal Counter',
      rating: 4.8,
    },
    features: ['Fuel Efficient (5.8L/100km)', 'Instant Confirmation', 'Reverse Camera & Sensors'],
    depositAmount: 250,
    mileagePolicy: 'Unlimited Mileage',
    fuelPolicy: 'Like for Like (Full to Full)',
    cancellationFreeHours: 48,
  },
  {
    id: 'kia-carnival-van',
    name: 'Kia Carnival 8-Seater or similar',
    category: 'People Mover / Van',
    acrissCode: 'MVAR',
    badge: 'Family Pick',
    seats: 8,
    bags: 5,
    doors: 5,
    gear: 'Automatic',
    fuel: 'Diesel / Petrol',
    rating: 4.95,
    reviewsCount: 180,
    pricePerDay: 89,
    currency: '$',
    image: '/images/vehicles/family-mpv.jpg',
    supplier: {
      name: 'TrustGo Airport Fleet Center',
      locationType: 'Free Shuttle Bus',
      rating: 4.9,
    },
    features: [
      'Dual Power Sliding Doors',
      'Tri-zone Climate Control',
      'Huge Luggage Capacity',
      '8 Full Adult Seats',
    ],
    depositAmount: 400,
    mileagePolicy: 'Limited (250 km/day)',
    fuelPolicy: 'Like for Like (Full to Full)',
    cancellationFreeHours: 48,
  },
  {
    id: 'tesla-model-y-electric',
    name: 'Tesla Model Y Dual Motor AWD',
    category: 'Premium Electric SUV',
    acrissCode: 'FDAC',
    badge: 'Green Electric',
    seats: 5,
    bags: 3,
    doors: 5,
    gear: 'Automatic',
    fuel: 'Electric',
    rating: 4.92,
    reviewsCount: 156,
    pricePerDay: 75,
    currency: '$',
    image:
      'https://images.unsplash.com/photo-1560958089-b8a1929cea89?auto=format&fit=crop&w=1200&q=80',
    supplier: {
      name: 'TrustGo EV Experience Hub',
      locationType: 'In-Terminal Counter',
      rating: 4.95,
    },
    features: [
      'Supercharging Capable',
      'Autopilot Included',
      'Panoramic Glass Roof',
      'Zero Tailpipe Emissions',
    ],
    depositAmount: 500,
    mileagePolicy: 'Unlimited Mileage',
    fuelPolicy: 'Like for Like (Full to Full)',
    cancellationFreeHours: 48,
  },
];

export function getVehicleById(id: string): FleetVehicle | undefined {
  return FLEET_VEHICLES.find((v) => v.id === id);
}
