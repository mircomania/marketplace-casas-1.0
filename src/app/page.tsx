'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { useEffect, useState } from 'react';

type Property = {
  id: string;
  title: string;
  price: number;
  mainImage: string;
  secondImage: string;
};

export default function Home() {
  const { loading, saving, isFavorite, toggleFavorite } = useFavorites();
  const [properties, setProperties] = useState<Property[]>([]);
  const [propertiesLoading, setPropertiesLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const res = await fetch('/api/properties');
        const data = await res.json();

        setProperties(data);
      } catch (error) {
        console.error(error);
      } finally {
        setPropertiesLoading(false);
      }
    };

    fetchProperties();
  }, []);

  return (
    <main>
      <h1>Inicio Marketplace Casas</h1>

      {(loading || propertiesLoading) && <p>Cargando...</p>}

      <div>
        {properties.map((prop) => (
          <div key={prop.id} style={{ marginBottom: '10px' }}>
            <h3>{prop.title}</h3>
            <p>${prop.price}</p>

            <button onClick={() => toggleFavorite(prop.id)} disabled={loading || saving === prop.id}>
              {isFavorite(prop.id) ? '⭐' : '☆'}
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}
