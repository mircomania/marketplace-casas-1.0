import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

type AuthMode = 'return-null' | 'redirect' | 'throw';

export async function requireAuth(mode: AuthMode = 'return-null') {
  const session = await getServerSession(authOptions);

  if (session) {
    return session;
  }

  switch (mode) {
    case 'redirect':
      redirect('/login');

    case 'throw':
      throw new Error('No autorizado');

    case 'return-null':
    default:
      return null;
  }
}

/* cconst session = await requireAuth(); DEFAULT NULL */
/* const session = await requireAuth('redirect') REDIRIJE A /LOGIN */
/* const session = await requireAuth('throw'); SALTA ERROR "NO AUTORIZADO" */
