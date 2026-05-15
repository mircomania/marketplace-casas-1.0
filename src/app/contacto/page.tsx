import { requireAuth } from '@/lib/requireAuth';

import Form from '@/components/Form';

export default async function Contacto() {
  const session = await requireAuth();

  if (!session) {
    return <p>No autorizado</p>;
  }

  return (
    <main>
      <h1>Contacto</h1>

      <Form />
    </main>
  );
}
