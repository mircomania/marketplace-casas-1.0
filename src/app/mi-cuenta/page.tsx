import { requireAuth } from '@/lib/requireAuth';
import Link from 'next/link';

export default async function MiCuentaPage() {
  const session = await requireAuth();

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
