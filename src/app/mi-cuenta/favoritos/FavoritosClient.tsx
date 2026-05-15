'use client';

import { useFavorites } from '@/hooks/useFavorites';
import { useProperties } from '@/hooks/useProperties';

export default function FavoritosClient() {
  const { favorites, loading: favoritesLoading } = useFavorites();

  const { properties, loading: propertiesLoading } = useProperties(favorites);

  if (favoritesLoading || propertiesLoading) {
    return <p>Cargando...</p>;
  }

  return (
    <main>
      <h1>Mis Favoritos</h1>

      {properties.length === 0 ? (
        <p>No tienes favoritos</p>
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
