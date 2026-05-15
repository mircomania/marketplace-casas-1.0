import { requireAuth } from '@/lib/requireAuth';
import FavoritosClient from './FavoritosClient';

export default async function FavoritosPage() {
  const session = await requireAuth();

  if (!session) {
    return <p>No autorizado</p>;
  }

  return <FavoritosClient />;
}
