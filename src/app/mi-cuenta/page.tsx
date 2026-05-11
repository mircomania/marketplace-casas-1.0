'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';

export default function MiCuentaPage() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return <p>Cargando...</p>;
  }

  if (!session) {
    return <p>No autorizado</p>;
  }

  return (
    <main>
      <h1>Mi Cuenta</h1>

      <div>
        <p>
          <strong>Nombre:</strong> {session.user?.name}
        </p>

        <p>
          <strong>Correo:</strong> {session.user?.email}
        </p>
      </div>

      <hr />

      <div>
        <Link href="/mi-cuenta/favoritos">Mis Favoritos</Link>
      </div>

      <div>
        <Link href="/mi-cuenta/publicaciones">Mis Publicaciones</Link>
      </div>
    </main>
  );
}
