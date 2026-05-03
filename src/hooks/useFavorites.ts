import { useEffect, useState } from 'react';

type Favorite = {
  property_id: string;
};

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);

  const isFavorite = (id: string) => favorites.includes(id);

  const fetchFavorites = async () => {
    const res = await fetch('/api/favorites');

    if (res.status === 401) {
      setLoading(false);
      return;
    }

    const data: Favorite[] = await res.json();
    setFavorites(data.map((f) => f.property_id));
    setLoading(false);
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const toggleFavorite = async (id: string) => {
    if (saving === id) return;

    setSaving(id);

    const alreadyFav = isFavorite(id);

    // optimistic update
    if (alreadyFav) {
      setFavorites((prev) => prev.filter((f) => f !== id));
    } else {
      setFavorites((prev) => [...prev, id]);
    }

    try {
      const method = alreadyFav ? 'DELETE' : 'POST';

      const res = await fetch('/api/favorites', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ property_id: id }),
      });

      if (!res.ok) {
        throw new Error('Error backend');
      }
    } catch (err) {
      // rollback si falla
      if (alreadyFav) {
        setFavorites((prev) => [...prev, id]);
      } else {
        setFavorites((prev) => prev.filter((f) => f !== id));
      }
    } finally {
      setSaving(null);
    }
  };

  return {
    favorites,
    loading,
    saving,
    isFavorite,
    toggleFavorite,
  };
}
