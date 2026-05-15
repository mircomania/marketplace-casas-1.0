import { requireAuth } from '@/lib/requireAuth';
import PublicacionesClient from './PublicacionesClient';

export default async function PublicacionesPage() {
  const session = await requireAuth();

  if (!session) {
    return <p>No autorizado</p>;
  }

  return <PublicacionesClient />;
}
