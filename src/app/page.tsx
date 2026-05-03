'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { properties } from '@/lib/properties';

export default function Home() {
  const { loading, saving, isFavorite, toggleFavorite } = useFavorites();

  return (
    <main>
      <h1>Inicio Marketplace Casas</h1>

      {loading && <p>Cargando favoritos...</p>}

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
