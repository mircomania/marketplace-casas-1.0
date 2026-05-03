import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

// GET favoritos
export async function GET() {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { data, error } = await supabase.from('favorites').select('*').eq('user_id', session.user.id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json(data);
}

// POST favoritos

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { property_id } = await req.json();

  if (!property_id || typeof property_id !== 'string') {
    return NextResponse.json({ error: 'property_id inválido' }, { status: 400 });
  }

  const { error } = await supabase.from('favorites').insert({
    user_id: session.user.id,
    property_id,
  });

  if (error) {
    // error duplicado
    if (error.code === '23505') {
      return NextResponse.json({ alreadyExists: true }, { status: 200 });
    }

    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}

// DELETE favoritos

export async function DELETE(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user?.id) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const { property_id } = await req.json();

  if (!property_id || typeof property_id !== 'string') {
    return NextResponse.json({ error: 'property_id inválido' }, { status: 400 });
  }

  const { error } = await supabase.from('favorites').delete().eq('user_id', session.user.id).eq('property_id', property_id);

  if (error) {
    return NextResponse.json({ error }, { status: 500 });
  }

  return NextResponse.json({ success: true });
}
