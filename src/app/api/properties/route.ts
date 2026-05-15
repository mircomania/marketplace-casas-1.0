import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const ids = searchParams.get('ids');

    let query = supabase.from('properties').select('*').eq('status', 'published');

    // filtrar por ids
    if (ids) {
      const idsArray = ids.split(',');

      query = query.in('public_id', idsArray);
    }

    const { data, error } = await query;

    if (error) {
      console.error(error);

      return NextResponse.json({ error: 'Error obteniendo propiedades' }, { status: 500 });
    }

    const properties = data.map((property) => ({
      id: property.public_id,

      title: property.title,

      price: property.price,

      mainImage: property.main_img,

      secondImage: property.second_img,

      slug: property.slug,
    }));

    return NextResponse.json(properties);
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Error interno servidor' }, { status: 500 });
  }
}
