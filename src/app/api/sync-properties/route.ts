import { NextResponse } from 'next/server';
import base from '@/lib/airtable';
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

export async function GET() {
  try {
    const records = await base(process.env.AIRTABLE_TABLE_PROP!).select({}).all();

    const properties = await Promise.all(
      records.map(async (record) => {
        const title = record.get('name') as string;
        const publicId = record.get('public_id') as string;

        // buscar si ya existe
        const { data: existingProperty } = await supabaseAdmin.from('properties').select('public_id, slug').eq('public_id', publicId).maybeSingle();

        return {
          airtable_record_id: record.id,

          public_id: publicId || generatePublicId(),

          slug: existingProperty?.slug || generateSlug(title),

          title,

          price: record.get('price') as number,

          main_img: (record.get('main_img') as readonly { url: string }[])?.[0]?.url || '',

          second_img: (record.get('second_img') as readonly { url: string }[])?.[0]?.url || '',

          status: record.get('status') || 'approved',

          source: 'agent',
        };
      }),
    );

    for (const property of properties) {
      const { data: existingProperty } = await supabaseAdmin.from('properties').select('id').eq('public_id', property.public_id).maybeSingle();

      if (existingProperty) {
        // UPDATE
        const { error } = await supabaseAdmin
          .from('properties')
          .update({
            airtable_record_id: property.airtable_record_id,
            slug: property.slug,
            title: property.title,
            price: property.price,
            main_img: property.main_img,
            second_img: property.second_img,
            status: property.status,
          })
          .eq('id', existingProperty.id);

        if (error) {
          console.error('UPDATE ERROR:', error);
        }
      } else {
        // INSERT
        const { error } = await supabaseAdmin.from('properties').insert(property);

        if (error) {
          console.error('INSERT ERROR:', error);
        }
      }
    }

    return NextResponse.json({
      success: true,
      synced: properties.length,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({ error: 'Error interno sync' }, { status: 500 });
  }
}
