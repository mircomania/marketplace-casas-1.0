import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

import { authOptions } from '../auth/[...nextauth]/route';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { data, error } = await supabase.from('properties').select('*').eq('user_id', session.user.id).order('created_at', { ascending: false });

    if (error) {
      return NextResponse.json({ error }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Error interno' }, { status: 500 });
  }
}
