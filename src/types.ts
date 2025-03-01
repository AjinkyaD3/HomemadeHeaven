export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'frame' | 'gift'| 'bracelet' | 'necklace' | 'earrings' | 'ring' | 'watch' | 'other' |'gift-hamper'| 'phoneCase';
  customizable: boolean;
  materials: string[];
  dimensions?: {
    width: number;
    height: number;
    depth: number;
    unit: 'cm' | 'in';
  };
  inStock: boolean;
  featured: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
  customizations?: {
    color?: string;
    material?: string;
    engraving?: string;
    size?: string;
  };
}

export interface Order {
  id: string;
  items: CartItem[];
  status: 'pending' | 'processing' | 'shipped' | 'delivered';
  createdAt: string;
  total: number;
  shippingAddress: {
    name: string;
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
}