import { Product } from '../types';

import img1 from './../assests/bracelet/bracelet- (1).jpeg';
import frameImg1 from './../assests/frames/frames- (1).jpeg'; // Example frame image
import hamperImg1 from './../assests/giftHamper/giftHampers- (1).jpeg'; // Example gift hamper image
import phoneCaseImg1 from './../assests/phoneCase/phoneCase- (1).jpeg';

export const products: Product[] = [
  {
    id: '1',
    name: 'Rustic Wooden Picture Frame',
    description: 'Handcrafted wooden frame made from reclaimed barn wood. Each piece tells a story with its unique grain patterns and natural imperfections.',
    price: 45.99,
    imageUrl: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'frame',
    customizable: true,
    materials: ['reclaimed wood', 'glass'],
    dimensions: {
      width: 20,
      height: 25,
      depth: 2,
      unit: 'cm'
    },
    inStock: true,
    featured: true
  },
  {
    id: '2',
    name: 'Personalized Family Name Sign',
    description: 'Beautiful hand-carved wooden sign customized with your family name. Perfect for entryways, living rooms, or as a thoughtful housewarming gift.',
    price: 65.99,
    imageUrl: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'gift',
    customizable: true,
    materials: ['oak wood', 'non-toxic paint'],
    dimensions: {
      width: 40,
      height: 15,
      depth: 2,
      unit: 'cm'
    },
    inStock: true,
    featured: true
  },
  {
    id: '3',
    name: 'Vintage Metal Photo Frame',
    description: 'Elegant metal frame with antique finish. Adds a touch of vintage charm to any photo or artwork.',
    price: 38.50,
    imageUrl: 'https://images.unsplash.com/photo-1579541591970-e5c7ecf35b1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'frame',
    customizable: false,
    materials: ['brushed metal', 'glass'],
    dimensions: {
      width: 15,
      height: 20,
      depth: 1.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '4',
    name: 'Hand-Painted Ceramic Vase',
    description: 'Unique ceramic vase hand-painted with intricate floral designs. Each piece is one-of-a-kind and signed by the artist.',
    price: 89.99,
    imageUrl: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'gift',
    customizable: false,
    materials: ['ceramic', 'non-toxic paint'],
    dimensions: {
      width: 12,
      height: 25,
      depth: 12,
      unit: 'cm'
    },
    inStock: true,
    featured: true
  },
  {
    id: '5',
    name: 'Custom Engraved Wooden Box',
    description: 'Handcrafted wooden keepsake box with custom engraving. Perfect for storing treasured memories or as a personalized gift.',
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1584727638096-042c45049ebe?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'gift',
    customizable: true,
    materials: ['walnut wood', 'brass hinges'],
    dimensions: {
      width: 18,
      height: 10,
      depth: 12,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '6',
    name: 'Floating Glass Frame',
    description: 'Modern floating glass frame that creates the illusion of your photo suspended in mid-air. Perfect for displaying special memories.',
    price: 49.99,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'frame',
    customizable: false,
    materials: ['tempered glass', 'stainless steel clips'],
    dimensions: {
      width: 25,
      height: 25,
      depth: 2,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '7',
    name: 'Handwoven Wall Tapestry',
    description: 'Beautifully handwoven wall tapestry made with natural fibers and dyes. Adds texture and warmth to any room.',
    price: 120.00,
    imageUrl: 'https://images.unsplash.com/photo-1615529328331-f8917597711f?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'gift',
    customizable: false,
    materials: ['cotton', 'wool', 'natural dyes'],
    dimensions: {
      width: 90,
      height: 60,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: true
  },
  {
    id: '8',
    name: 'Personalized Birth Announcement Frame',
    description: 'Custom frame to celebrate a new arrival. Includes space for name, birth date, weight, and a special photo.',
    price: 75.50,
    imageUrl: 'https://images.unsplash.com/photo-1519689680058-324335c77eba?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    category: 'frame',
    customizable: true,
    materials: ['maple wood', 'glass', 'archival paper'],
    dimensions: {
      width: 30,
      height: 40,
      depth: 2,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '9',
    name: 'Bracelet 1',
    description: 'Stylish bracelet crafted from high-quality materials, perfect for any occasion.',
    price: 24.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['metal', 'leather'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '10',
    name: 'Bracelet 2',
    description: 'Elegant bracelet with a touch of class, perfect for formal events or daily wear.',
    price: 29.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['silver', 'gems'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '11',
    name: 'Bracelet 3',
    description: 'Handcrafted bracelet with intricate designs and premium finish.',
    price: 34.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['gold', 'stones'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '12',
    name: 'Bracelet 4',
    description: 'Fashionable bracelet designed with a modern touch, great for casual wear.',
    price: 19.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['stainless steel', 'silicone'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '13',
    name: 'Bracelet 5',
    description: 'Sophisticated bracelet with an elegant design, perfect for any special occasion.',
    price: 40.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['platinum', 'crystals'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '14',
    name: 'Bracelet 6',
    description: 'Simple yet elegant bracelet that adds a subtle charm to your look.',
    price: 22.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['leather', 'wood'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '15',
    name: 'Bracelet 7',
    description: 'Versatile bracelet perfect for both casual and formal settings.',
    price: 27.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['aluminum', 'tungsten'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '16',
    name: 'Bracelet 8',
    description: 'Charming bracelet with a mix of traditional and modern elements.',
    price: 39.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['brass', 'pearl'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '17',
    name: 'Bracelet 9',
    description: 'Stylish bracelet with a unique design, great for everyday wear.',
    price: 18.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['silver', 'rubber'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '18',
    name: 'Bracelet 10',
    description: 'Sophisticated and sleek, this bracelet exudes luxury and class.',
    price: 50.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['gold', 'diamonds'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '19',
    name: 'Bracelet 11',
    description: 'Handcrafted bracelet that combines modern style with traditional techniques.',
    price: 45.00,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['copper', 'stone'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '20',
    name: 'Bracelet 12',
    description: 'A striking bracelet with a combination of elegant and modern design elements.',
    price: 55.99,
    imageUrl: img1, // Image path from assets.js
    category: 'bracelet',
    customizable: false,
    materials: ['titanium', 'crystals'],
    dimensions: {
      width: 2,
      height: 1,
      depth: 0.5,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },
  {
    id: '21',
    name: 'Elegant Gold Frame',
    description: 'A beautifully designed gold frame that brings elegance to any photo or artwork.',
    price: 59.99,
    imageUrl: frameImg1,
    category: 'frame',
    customizable: true,
    materials: ['metal', 'glass'],
    dimensions: {
      width: 30,
      height: 40,
      depth: 3,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },

  // Adding Gift Hampers
  {
    id: '22',
    name: 'Luxury Gift Hamper',
    description: 'A beautifully packed hamper filled with gourmet chocolates, wine, and premium snacks.',
    price: 99.99,
    imageUrl: hamperImg1,
    category: 'gift-hamper',
    customizable: false,
    materials: ['wooden box', 'gourmet items'],
    dimensions: {
      width: 40,
      height: 30,
      depth: 15,
      unit: 'cm'
    },
    inStock: true,
    featured: true
  },

  // Adding more Gift Hampers
  {
    id: '23',
    name: 'Classic Celebration Hamper',
    description: 'A perfect gift hamper for special occasions, with an assortment of teas, biscuits, and artisanal treats.',
    price: 75.00,
    imageUrl: hamperImg1,
    category: 'gift-hamper',
    customizable: false,
    materials: ['wicker basket', 'tea', 'biscuits'],
    dimensions: {
      width: 35,
      height: 25,
      depth: 12,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },

  // Adding Phone Cases
  {
    id: '24',
    name: 'Customizable Phone Case for iPhone',
    description: 'A personalized phone case for iPhone with a unique design or your favorite photo.',
    price: 19.99,
    imageUrl: phoneCaseImg1,
    category: 'phoneCase',
    customizable: true,
    materials: ['polycarbonate'],
    dimensions: {
      width: 7,
      height: 15,
      depth: 0.8,
      unit: 'cm'
    },
    inStock: true,
    featured: true
  },

  // Adding more Phone Cases
  {
    id: '25',
    name: 'Sleek Leather Phone Case',
    description: 'A high-quality leather phone case that adds a touch of elegance and protection to your phone.',
    price: 39.99,
    imageUrl: phoneCaseImg1,
    category: 'phoneCase',
    customizable: false,
    materials: ['genuine leather'],
    dimensions: {
      width: 8,
      height: 15,
      depth: 1,
      unit: 'cm'
    },
    inStock: true,
    featured: false
  },

  // Adding Bracelet products (Existing)
 

];