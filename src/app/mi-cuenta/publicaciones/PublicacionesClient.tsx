'use client';

import { useMyProperties } from '@/hooks/useMyProperties';

export default function PublicacionesClient() {
  const { properties, loading } = useMyProperties();

  if (loading) {
    return <p>Cargando...</p>;
  }

  return (
    <main>
      <h1>Mis Publicaciones</h1>

      {properties.length === 0 ? (
        <p>No tienes publicaciones</p>
      ) : (
        properties.map((property) => (
          <div key={property.id}>
            <h3>{property.title}</h3>

            <p>${property.price}</p>

            <p>Estado: {property.status}</p>
          </div>
        ))
      )}
    </main>
  );
}
