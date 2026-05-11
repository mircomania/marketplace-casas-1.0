'use client';

import { useState } from 'react';
import useSWR from 'swr';

type Favorite = {
  property_id: string;
};

const fetcher = async (url: string): Promise<string[]> => {
  const res = await fetch(url);

  if (res.status === 401) {
    return [];
  }

  if (!res.ok) {
    throw new Error('Error obteniendo favoritos');
  }

  const data: Favorite[] = await res.json();

  return data.map((f) => f.property_id);
};

export function useFavorites() {
  const [saving, setSaving] = useState<string | null>(null);

  // SWR
  const { data: favorites = [], error, isLoading, mutate } = useSWR('/api/favorites', fetcher);

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = async (id: string) => {
    if (saving === id) return;

    setSaving(id);

    const alreadyFav = isFavorite(id);

    // optimistic update
    const optimisticFavorites = alreadyFav ? favorites.filter((f) => f !== id) : [...favorites, id];

    // actualiza cache local instantáneamente
    mutate(optimisticFavorites, false);

    try {
      const method = alreadyFav ? 'DELETE' : 'POST';

      const res = await fetch('/api/favorites', {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ property_id: id }),
      });

      if (!res.ok) {
        throw new Error('Error backend');
      }

      // revalidar contra backend real
      await mutate();
    } catch (err) {
      // rollback
      mutate(favorites, false);
      console.error(err);
    } finally {
      setSaving(null);
    }
  };

  return {
    favorites,
    loading: isLoading,
    error,
    saving,
    isFavorite,
    toggleFavorite,
  };
}
