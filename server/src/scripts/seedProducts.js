import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Product from '../models/Product.js';

dotenv.config();

const products = [
    {
        name: 'Rustic Wooden Picture Frame',
        description: 'Handcrafted wooden frame made from reclaimed barn wood. Each piece tells a story with its unique grain patterns and natural imperfections.',
        price: 45.99,
        image: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'frame',
        stock: 10,
        customizable: true,
        materials: ['reclaimed wood', 'glass'],
        dimensions: {
            width: 20,
            height: 25,
            depth: 2,
            unit: 'cm'
        },
        isFeatured: true,
        isAvailable: true
    },
    {
        name: 'Personalized Family Name Sign',
        description: 'Beautiful hand-carved wooden sign customized with your family name. Perfect for entryways, living rooms, or as a thoughtful housewarming gift.',
        price: 65.99,
        image: 'https://images.unsplash.com/photo-1519710164239-da123dc03ef4?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'gift',
        stock: 15,
        customizable: true,
        materials: ['oak wood', 'non-toxic paint'],
        dimensions: {
            width: 40,
            height: 15,
            depth: 2,
            unit: 'cm'
        },
        isFeatured: true,
        isAvailable: true
    },
    {
        name: 'Vintage Metal Photo Frame',
        description: 'Elegant metal frame with antique finish. Adds a touch of vintage charm to any photo or artwork.',
        price: 38.50,
        image: 'https://images.unsplash.com/photo-1579541591970-e5c7ecf35b1e?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'frame',
        stock: 8,
        customizable: false,
        materials: ['brushed metal', 'glass'],
        dimensions: {
            width: 15,
            height: 20,
            depth: 1.5,
            unit: 'cm'
        },
        isFeatured: false,
        isAvailable: true
    },
    {
        name: 'Hand-Painted Ceramic Vase',
        description: 'Unique ceramic vase hand-painted with intricate floral designs. Each piece is one-of-a-kind and signed by the artist.',
        price: 89.99,
        image: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
        category: 'gift',
        stock: 5,
        customizable: false,
        materials: ['ceramic', 'non-toxic paint'],
        dimensions: {
            width: 12,
            height: 25,
            depth: 12,
            unit: 'cm'
        },
        isFeatured: true,
        isAvailable: true
    }
];

const seedProducts = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB');

        // Clear existing products
        await Product.deleteMany({});
        console.log('Cleared existing products');

        // Insert new products
        const insertedProducts = await Product.insertMany(products);
        console.log(`Successfully inserted ${insertedProducts.length} products`);

        // Close the connection
        await mongoose.connection.close();
        console.log('Database connection closed');
    } catch (error) {
        console.error('Error seeding products:', error);
        process.exit(1);
    }
};

// Run the seeding function
seedProducts(); 