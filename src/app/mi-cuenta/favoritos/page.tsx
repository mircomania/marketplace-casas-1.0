'use client';

import { useEffect, useState } from 'react';
import { useFavorites } from '@/hooks/useFavorites';

type Property = {
  id: string;
  title: string;
  price: number;
  mainImage: string;
};

export default function FavoritosPage() {
  const { favorites, loading } = useFavorites();

  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (favorites.length === 0) {
        setProperties([]);
        setPropertiesLoading(false);
        return;
      }

      try {
        const ids = favorites.join(',');

        const res = await fetch(`/api/properties?ids=${ids}`);

        const data = await res.json();

        setProperties(data);
      } catch (error) {
        console.error(error);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProperties();
  }, [favorites]);

  if (loading || propertiesLoading) {
    return <p>Cargando favoritos...</p>;
  }

  return (
    <main>
      <h1>Mis Favoritos</h1>

      {properties.length === 0 ? (
        <p>No tienes favoritos.</p>
      ) : (
        properties.map((prop) => (
          <div key={prop.id}>
            <h3>{prop.title}</h3>

            <p>${prop.price}</p>
          </div>
        ))
      )}
    </main>
  );
}
