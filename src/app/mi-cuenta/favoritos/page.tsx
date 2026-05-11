'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { properties } from '@/lib/properties';

export default function FavoritosPage() {
  const { favorites, loading } = useFavorites();

  if (loading) {
    return <p>Cargando favoritos...</p>;
  }

  const favoriteProperties = properties.filter((prop) => favorites.includes(prop.id));

  return (
    <main>
      <h1>Mis Favoritos</h1>

      {favoriteProperties.length === 0 ? (
        <p>No tienes favoritos.</p>
      ) : (
        favoriteProperties.map((prop) => (
          <div key={prop.id}>
            <h3>{prop.title}</h3>
            <p>${prop.price}</p>
          </div>
        ))
      )}
    </main>
  );
}
