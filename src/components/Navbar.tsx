'use client';

import Link from 'next/link';
import { signIn, signOut, useSession } from 'next-auth/react';

export default function Navbar() {
  const { data: session } = useSession();
  console.log(session?.user?.id);

  return (
    <nav style={{ display: 'flex', gap: '10px' }}>
      <Link href="/">Inicio</Link>
      <Link href="/contacto">Contacto</Link>
      <Link href="/mi-cuenta">Mi cuenta</Link>

      {session ? (
        <>
          <span>{session.user?.name}</span>
          <button onClick={() => signOut()}>Cerrar sesión</button>
        </>
      ) : (
        <button onClick={() => signIn('google')}>Login con Google</button>
      )}
    </nav>
  );
}
