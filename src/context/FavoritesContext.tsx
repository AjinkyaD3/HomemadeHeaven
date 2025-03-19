import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface FavoritesContextType {
    favorites: string[];
    addToFavorites: (productId: string) => Promise<void>;
    removeFromFavorites: (productId: string) => Promise<void>;
    isFavorite: (productId: string) => boolean;
    isLoading: boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

export const useFavorites = () => {
    const context = useContext(FavoritesContext);
    if (!context) {
        throw new Error('useFavorites must be used within a FavoritesProvider');
    }
    return context;
};

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [favorites, setFavorites] = useState<string[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchFavorites();
    }, []);

    const fetchFavorites = async () => {
        try {
            const data = await api.getFavorites();
            setFavorites(data.map((fav: any) => fav.productId));
        } catch (error) {
            console.error('Error fetching favorites:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToFavorites = async (productId: string) => {
        try {
            await api.toggleFavorite(productId);
            setFavorites(prev => [...prev, productId]);
            toast.success('Added to favorites');
        } catch (error) {
            console.error('Error adding to favorites:', error);
            toast.error('Failed to add to favorites');
            throw error;
        }
    };

    const removeFromFavorites = async (productId: string) => {
        try {
            await api.toggleFavorite(productId);
            setFavorites(prev => prev.filter(id => id !== productId));
            toast.success('Removed from favorites');
        } catch (error) {
            console.error('Error removing from favorites:', error);
            toast.error('Failed to remove from favorites');
            throw error;
        }
    };

    const isFavorite = (productId: string) => favorites.includes(productId);

    return (
        <FavoritesContext.Provider value={{ favorites, addToFavorites, removeFromFavorites, isFavorite, isLoading }}>
            {children}
        </FavoritesContext.Provider>
    );
};