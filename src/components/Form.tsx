'use client';

import { useState } from 'react';

export default function Form() {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);

    try {
      const res = await fetch('/api/create-property', {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
        },

        body: JSON.stringify({
          title,
          price: Number(price),
        }),
      });

      const data = await res.json();

      console.log(data);

      if (!res.ok) {
        alert('Error creando propiedad');
        return;
      }

      alert('Propiedad enviada correctamente');

      setTitle('');
      setPrice('');
    } catch (error) {
      console.error(error);

      alert('Error servidor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Título</label>

        <input type="text" value={title} onChange={(e) => setTitle(e.target.value)} required />
      </div>

      <div>
        <label>Precio</label>

        <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : 'Enviar'}
      </button>
    </form>
  );
}
