import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth';

import { authOptions } from '../auth/[...nextauth]/route';

import { supabaseAdmin } from '@/lib/supabaseAdmin';

function generateSlug(title: string) {
  return title
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-');
}

function generatePublicId() {
  return `PROP-${crypto.randomUUID().split('-')[0].toUpperCase()}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const body = await req.json();

    const { title, price } = body;

    if (!title || !price) {
      return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 });
    }

    const property = {
      title,

      price,

      slug: generateSlug(title),

      public_id: generatePublicId(),

      user_id: session.user.id,

      status: 'pending',

      source: 'form',
    };

    const { data, error } = await supabaseAdmin.from('properties').insert(property).select().single();

    if (error) {
      console.error(error);

      return NextResponse.json({ error: 'Error creando propiedad' }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      property: data,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Error interno servidor' }, { status: 500 });
  }
}
